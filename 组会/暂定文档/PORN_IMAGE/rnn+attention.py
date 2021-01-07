import numpy as np
import time
import os
import math
import sys
import tables
import json
import random
from tqdm import tqdm

import torch 
import torch.utils.data as data
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim

import logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG, format="%(message)s")#,format="%(asctime)s: %(name)s: %(levelname)s: %(message)s")


PAD_ID, SOS_ID, EOS_ID, UNK_ID = [0, 1, 2, 3]

def asHHMMSS(s):
    m = math.floor(s / 60)
    s -= m * 60
    h = math.floor(m /60)
    m -= h *60
    return '%d:%d:%d'% (h, m, s)

def timeSince(since, percent):
    now = time.time()
    s = now - since
    es = s / (percent)
    rs = es - s
    return '%s<%s'%(asHHMMSS(s), asHHMMSS(rs))

import nltk
try: 
    nltk.word_tokenize("hello world")
except LookupError: 
    nltk.download('punkt')
    
def sent2indexes(sentence, vocab, maxlen):
    '''sentence: a string or list of string
       return: a numpy array of word indices
    '''      
    def convert_sent(sent, vocab, maxlen):
        idxes = np.zeros(maxlen, dtype=np.int64)
        idxes.fill(PAD_ID)
        tokens = nltk.word_tokenize(sent.strip())
        idx_len = min(len(tokens), maxlen)
        for i in range(idx_len): idxes[i] = vocab.get(tokens[i], UNK_ID)
        return idxes, idx_len
    if type(sentence) is list:
        inds, lens = [], []
        for sent in sentence:
            idxes, idx_len = convert_sent(sent, vocab, maxlen)
            #idxes, idx_len = np.expand_dims(idxes, 0), np.array([idx_len])
            inds.append(idxes)
            lens.append(idx_len)
        return np.vstack(inds), np.vstack(lens)
    else:
        inds, lens = sent2indexes([sentence], vocab, maxlen)
        return inds[0], lens[0]

def indexes2sent(indexes, vocab, ignore_tok=PAD_ID): 
    '''indexes: numpy array'''
    def revert_sent(indexes, ivocab, ignore_tok=PAD_ID):
        toks=[]
        length=0
        indexes=filter(lambda i: i!=ignore_tok, indexes)
        for idx in indexes:
            toks.append(ivocab[idx])
            length+=1
            if idx == EOS_ID:
                break
        return ' '.join(toks), length
    
    ivocab = {v: k for k, v in vocab.items()}
    if indexes.ndim==1:# one sentence
        return revert_sent(indexes, ivocab, ignore_tok)
    else:# dim>1
        sentences=[] # a batch of sentences
        lens=[]
        for inds in indexes:
            sentence, length = revert_sent(inds, ivocab, ignore_tok)
            sentences.append(sentence)
            lens.append(length)
        return sentences, lens
    
def save_model(model, epoch):
    """Save model parameters to checkpoint"""
    ckpt_path=f'./output/checkpoint_iter{epoch}.pkl'
    #print(f'Saving model parameters to {ckpt_path}')
    torch.save(model.state_dict(), ckpt_path)
        
def load_model(model, epoch):
    """Load parameters from checkpoint"""
    ckpt_path=f'./output/checkpoint_iter{epoch}.pkl'
    #print(f'Loading model parameters from {ckpt_path}')
    model.load_state_dict(torch.load(ckpt_path))


def get_config():
    conf = {
    'maxlen':40, # maximum utterance length
    'diaglen':10, # how many utterance kept in the context window

    # Model Arguments
    'emb_size':512, # size of word embeddings
    'hid_utt':512, # number of rnn hidden units for utterance encoder
    'hid_ctx':512, # number of rnn hidden units for context encoder
    'hid_dec':512, # number of rnn hidden units for decoder
    'n_layers':2, # number of layers
    'dropout':0.3, # dropout applied to layers (0 = no dropout)
    'teach_force': 1, # use teach force for decoder
    'hidden_size': 512,
    'd_model': 512,
    # Training Arguments
    'batch_size':1,
    'epochs':10, # maximum number of epochs
    'lr':2e-4, # autoencoder learning rate
    'beta1':0.9, # beta1 for adam
    'init_w':0.05, # initial w
    'clip':5.0,  # gradient clipping, max norm
    'nucleus_p':0.9,
    'device': "cuda",
    }
    return conf 


class DialogDataset(data.Dataset):
    def __init__(self, filepath, max_ctx_len=7, max_utt_len=40):
        # 1. Initialize file path or list of file names.
        """read training sentences(list of int array) from a hdf5 file"""
        self.max_ctx_len=max_ctx_len
        self.max_utt_len=max_utt_len
        
        print("loading data...")
        table = tables.open_file(filepath)
        self.data = table.get_node('/sentences')[:].astype(np.long)
        self.index = table.get_node('/indices')[:]
        self.data_len = self.index.shape[0]
        print("{} entries".format(self.data_len))

    def __getitem__(self, offset):
        pos_utt, ctx_len, res_len = self.index[offset]['pos_utt'], self.index[offset]['ctx_len'], self.index[offset]['res_len']
        ctx_arr=self.data[pos_utt-ctx_len:pos_utt]
        res_arr=self.data[pos_utt:pos_utt+res_len]
        ## split context array into utterances
        context=[]
        utt_lens=[]
        utt=[]
        for i, tok in enumerate(ctx_arr):
            utt.append(ctx_arr[i])
            if tok==EOS_ID:
                if len(utt)<self.max_utt_len+1:
                    utt_lens.append(len(utt)-1)# floor is not counted in the utt length
                    utt.extend([PAD_ID]*(self.max_utt_len+1-len(utt)))  
                else:
                    utt=utt[:self.max_utt_len+1]
                    utt[-1]=EOS_ID
                    utt_lens.append(self.max_utt_len)
                context.append(utt)                
                utt=[]    
        if len(context)>self.max_ctx_len: # trunk long context
            context=context[-self.max_ctx_len:]
            utt_lens=utt_lens[-self.max_ctx_len:]
        context_len=len(context)
        
        if len(context)<self.max_ctx_len: # pad short context
            for i in range(len(context), self.max_ctx_len):
                context.append([0, SOS_ID, EOS_ID]+[PAD_ID]*(self.max_utt_len-2)) # [floor, <sos>, <eos>, <pad>, <pad> ...]
                utt_lens.append(2) # <s> and </s>
        context = np.array(context)        
        utt_lens=np.array(utt_lens)
        floors=context[:,0]
        context = context[:,1:]
        
        ## Padding ##    
        response = res_arr[1:]
        if len(response)<self.max_utt_len:
            res_len=len(response)
            response=np.append(response,[PAD_ID]*(self.max_utt_len-len(response)))
        else:
            response=response[:self.max_utt_len]
            response[-1]=EOS_ID
            res_len=self.max_utt_len

        return context, context_len, utt_lens, floors, response, res_len

    def __len__(self):
        return self.data_len
    

def load_dict(filename):
    return json.loads(open(filename, "r").readline())

def load_vecs(fin):         
    """read vectors (2D numpy array) from a hdf5 file"""
    h5f = tables.open_file(fin)
    h5vecs= h5f.root.vecs
    
    vecs=np.zeros(shape=h5vecs.shape,dtype=h5vecs.dtype)
    vecs[:]=h5vecs[:]
    h5f.close()
    return vecs


import torch.nn.init as weight_init
from torch.nn.utils.rnn import pack_padded_sequence, pad_packed_sequence
from torch.nn import MultiheadAttention,TransformerDecoderLayer,TransformerEncoderLayer
class PositionEmbedding(nn.Module):

    '''
    Position embedding for self-attention
    refer: https://pytorch.org/tutorials/beginner/transformer_tutorial.html
    d_model: word embedding size or output size of the self-attention blocks
    max_len: the max length of the input squeezec
    '''

    def __init__(self, d_model, dropout=0.1, max_len=5000):
        super(PositionEmbedding, self).__init__()
        self.dropout = nn.Dropout(p=dropout)

        pe = torch.zeros(max_len, d_model)    # [max_len, d_model]
        position = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)    # [1, max_len]
        div_term = torch.exp(torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model))
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        pe = pe.unsqueeze(0).transpose(0, 1)
        self.register_buffer('pe', pe)   # not the parameters of the Module

    def forward(self, x):
        x = x + self.pe[:x.size(0), :]
        return self.dropout(x)
class Attention(nn.Module):

    def __init__(self, hidden_size):
        super(Attention, self).__init__()
        # self.attn = nn.Linear(hidden_size * 2, hidden_size * 2)
        self.attn = nn.Linear(hidden_size * 2, hidden_size)
        # self.v = nn.Parameter(torch.rand(hidden_size * 2))
        self.v = nn.Parameter(torch.rand(hidden_size))
        stdv = 1. / math.sqrt(self.v.size(0))
        self.v.data.uniform_(-stdv, stdv)

    def forward(self, hidden, encoder_outputs):
        # hidden: from decoder, [batch, decoder_hidden_size]
        timestep = encoder_outputs.shape[0]
        h = hidden.repeat(timestep, 1, 1).transpose(0, 1)    # [batch, timestep, decoder_hidden_size]
        encoder_outputs = encoder_outputs.transpose(0, 1)    # [batch, timestep, encoder_hidden_size]

        # [batch, timestep]
        attn_energies = self.score(h, encoder_outputs)
        return F.softmax(attn_energies, dim=1).unsqueeze(1)    # [batch, 1, timestep]

    def score(self, hidden, encoder_outputs):
        # hidden: [batch, timestep, decoder_hidden_size]
        # encoder_outputs: [batch, timestep, encoder_hidden_size]
        # energy: [batch, timestep, hidden_size]
        energy = torch.tanh(self.attn(torch.cat([hidden, encoder_outputs], 2)))
        energy = energy.transpose(1, 2)    # [batch, 2 * hidden_size, timestep]
        v = self.v.repeat(encoder_outputs.size(0), 1).unsqueeze(1)    # [batch, 1, 2 * hidden_size]
        energy = torch.bmm(v, energy)    # [batch, 1, timestep]
        return energy.squeeze(1)    # [batch, timestep]

class Encoder(nn.Module):

    def __init__(self,device, input_size, embed_size, hidden_size,
                 n_layers=1, dropout=0.5):
        super(Encoder, self).__init__()
        self.device = device

        self.input_size = input_size
        self.hidden_size = hidden_size
        self.embed_size = embed_size
        self.n_layer = n_layers

        self.embed = nn.Embedding(input_size, embed_size)
        # self.input_dropout = nn.Dropout(p=dropout)
        self.rnn = nn.GRU(embed_size, hidden_size, num_layers=n_layers,
                          dropout=(0 if n_layers == 1 else dropout), bidirectional=True)
        # self.hidden_proj = nn.Linear(n_layers * hidden_size, hidden_size)
        # self.bn = nn.BatchNorm1d(num_features=hidden_size)
        self.init_weight()

    def init_weight(self):
        # orthogonal init
        torch.nn.init.xavier_normal_(self.rnn.weight_hh_l0)
        torch.nn.init.xavier_normal_(self.rnn.weight_ih_l0)
        self.rnn.bias_ih_l0.data.fill_(0.0)
        self.rnn.bias_hh_l0.data.fill_(0.0)

    def forward(self, src, inpt_lengths, hidden=None):
        embedded = self.embed(src)
        # embedded = self.input_dropout(embedded)
        # inpt: [seq_len, batch], lengths: [batch_size]
        if not hidden:
            hidden = torch.randn(self.n_layer * 2, src.shape[-1],
                                 self.hidden_size).to(self.device)

        embedded = nn.utils.rnn.pack_padded_sequence(embedded, inpt_lengths.to('cpu'),
                                                     enforce_sorted=False)
        _, hidden = self.rnn(embedded, hidden)
        # output, _ = nn.utils.rnn.pad_packed_sequence(output)
        # output = output[:, :, :self.hidden_size] + output[:, :, self.hidden_size:]
        # output = torch.tanh(output)
        # using .sum and .tanh to avoid the same output (always "I'm not sure, I don't know")
        hidden = hidden.sum(axis=0)
        # hidden = hidden.permute(1, 0, 2)
        # hidden = hidden.reshape(hidden.shape[0], -1)
        # hidden = self.bn(self.hidden_proj(hidden))
        hidden = torch.tanh(hidden)

        # [batch, hidden_size]
        return hidden

class Context_encoder(nn.Module):

    '''
    input_size is 2 * utterance_hidden_size
    '''

    def __init__(self, device, input_size, hidden_size, dropout=0.5):
        super(Context_encoder, self).__init__()
        self.device = device
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.rnn = nn.GRU(self.input_size, self.hidden_size, bidirectional=True)
        # self.drop = nn.Dropout(p=dropout)
        self.init_weight()

    def init_weight(self):
        torch.nn.init.xavier_normal_(self.rnn.weight_hh_l0)
        torch.nn.init.xavier_normal_(self.rnn.weight_ih_l0)
        self.rnn.bias_ih_l0.data.fill_(0.0)
        self.rnn.bias_hh_l0.data.fill_(0.0)

    def forward(self, inpt, hidden=None):
        # inpt: [turn_len, batch, input_size]
        # hidden
        if not hidden:
            hidden = torch.randn(2, inpt.shape[1], self.hidden_size).to(self.device)

        # inpt = self.drop(inpt)
        output, hidden = self.rnn(inpt, hidden)
        # [seq, batch, hidden]
        output = output[:, :, :self.hidden_size] + output[:, :, self.hidden_size:]

        # hidden: [2, batch, hidden_size]
        # hidden = hidden.squeeze(0)
        hidden = torch.tanh(hidden)
        return output, hidden

class Decoder(nn.Module):

    def __init__(self, device, output_size, embed_size, hidden_size, n_layer=2, dropout=0.5, pretrained=None):
        super(Decoder, self).__init__()
        self.device = device
        self.output_size = output_size
        self.hidden_size = hidden_size
        self.embed_size = embed_size
        self.embed = nn.Embedding(self.output_size, self.embed_size)
        self.rnn = nn.GRU(self.embed_size + self.hidden_size, self.hidden_size,
                          num_layers=n_layer,
                          dropout=(0 if n_layer == 1 else dropout))
        self.out = nn.Linear(hidden_size, output_size)

        # attention on context encoder
        self.attn = Attention(hidden_size)

        self.init_weight()

    def init_weight(self):
        torch.nn.init.xavier_normal_(self.rnn.weight_hh_l0)
        torch.nn.init.xavier_normal_(self.rnn.weight_ih_l0)
        self.rnn.bias_ih_l0.data.fill_(0.0)
        self.rnn.bias_hh_l0.data.fill_(0.0)

    def forward(self, inpt, last_hidden, encoder_outputs):
        # inpt: [batch_size], last_hidden: [2, batch, hidden_size]
        # encoder_outputs: [turn_len, batch, hidden_size]
        embedded = self.embed(inpt).unsqueeze(0)    # [1, batch_size, embed_size]
#         print(embedded.size())

        key = last_hidden.sum(axis=0)    # [batch, hidden_size]

        # [batch, 1, seq_len]
        attn_weights = self.attn(key, encoder_outputs)
        context = attn_weights.bmm(encoder_outputs.transpose(0, 1))
        context = context.transpose(0, 1)    # [1, batch, hidden]
#         print(context.size())
        rnn_input = torch.cat([embedded, context], 2)   # [1, batch, embed+hidden]

        # output: [1, batch, 2*hidden_size], hidden: [2, batch, hidden_size]
        output, hidden = self.rnn(rnn_input, last_hidden)
        output = output.squeeze(0)    # [batch, hidden_size]
        # context = context.squeeze(0)  # [batch, hidden]
        # output = torch.cat([output, context], 1)    # [batch, 2 * hidden]
        output = self.out(output)     # [batch, output_size]
        output = F.log_softmax(output, dim=1)
        return output, hidden

class MyModel(nn.Module):
    '''The basic Hierarchical Recurrent Encoder-Decoder model. '''
    def __init__(self, config, vocab_size, device = None , teach_force=0.5):
        super(MyModel, self).__init__()
        utter_n_layer = config['n_layers']
        utter_hidden = config['hid_utt']
        context_hidden = config['hid_ctx']
        decoder_hidden = config['hid_dec']
        input_size = vocab_size
        output_size = vocab_size
        embed_size = config['d_model']
        dropout = config['dropout']
        self.utt_encoder = Encoder(device,input_size, embed_size, utter_hidden, n_layers=utter_n_layer,
                               dropout=dropout)
        self.context_encoder = Context_encoder(device,utter_hidden,context_hidden,dropout=dropout)
        self.decoder = Decoder(device,output_size, embed_size, decoder_hidden,
                               dropout=dropout, n_layer=utter_n_layer)
        self.maxlen = config['maxlen']
        self.teach_force = teach_force
        self.pad, self.sos = PAD_ID, SOS_ID
        self.output_size = output_size
        self.utter_n_layer = utter_n_layer
        self.hidden_size = decoder_hidden
        self.optimizer = optim.Adam(self.parameters(),lr=config['lr'])
        self.softmax = nn.LogSoftmax(dim=-1)
        self.clip = config['clip']
        self.vocab_size = vocab_size
        self.criterion = nn.NLLLoss(ignore_index=PAD_ID)
        self.device = device

    def forward(self,context, context_lens, utt_lens, response, res_lens):
        dec_target = response[:,1:].clone()
#         dec_target = response.clone()

        # dec_target[response[:,1:]==PAD_ID] = -100
        # src: [turn, lengths, batch], tgt: [seq, batch], lengths: [turns, batch]
        src = context.transpose(0,1).transpose(1,2)
        lengths = utt_lens.transpose(0,1)
        tgt = response.transpose(0,1)
        turn_size, batch_size, max_len = len(src), tgt.size(1), tgt.size(0)
        turn_size = context_lens[0] #batch_size 是1时使用
        # encoder
        turns = []
        for i in range(turn_size):
            hidden = self.utt_encoder(src[i], lengths[i])
            turns.append(hidden)
        turns = torch.stack(turns)  # [turn_len, batch, utter_hidden]

        # context encoding
        # output: [seq, batch, hidden], [2, batch, hidden]
        context_output, hidden = self.context_encoder(turns)

        outputs = torch.zeros(max_len, batch_size, self.output_size).to(self.device)
        output = tgt[0, :] #[batch]

#         use_teacher = random.random() < self.teach_force
#         if use_teacher:
        for t in range(1, max_len):
#             print(t)
            output, hidden = self.decoder(output, hidden, context_output)
            outputs[t] = output
            output = tgt[t]
#         else:
#             for t in range(1, max_len):
#                 output, hidden = self.decoder(output, hidden, turns)
#                 outputs[t] = output
#                 output = output.topk(1)[1].squeeze().detach()        # [seq, batch, output_size]
        # return outputs
#         print(outputs.size())
        outputs = outputs.transpose(0,1)
        outputs = outputs[:,1:,:]
        loss = self.criterion(outputs.view(-1, self.vocab_size), dec_target.view(-1))
        # loss = nn.CrossEntropyLoss()(output.view(-1, self.vocab_size), dec_target.view(-1))
        return loss

    def train_batch(self, context, context_lens, utt_lens, response, res_lens):
        self.utt_encoder.train()
        self.context_encoder.train()
        self.decoder.train()
        loss = self.forward(context, context_lens, utt_lens, response, res_lens)
        self.optimizer.zero_grad()
        loss.backward()
        # `clip_grad_norm` to prevent exploding gradient in RNNs
        nn.utils.clip_grad_norm_(self.parameters(),self.clip)
#         nn.utils.clip_grad_norm_(list(self.tran_encoder.parameters())+list(self.tran_decoder.parameters()), self.clip)
        self.optimizer.step()

        return {'train_loss': loss.item()}      
    
    def valid(self, context, context_lens, utt_lens, response, res_lens):
        self.utt_encoder.eval()
        self.context_encoder.eval()
        self.decoder.eval()
        loss = self.forward(context, context_lens, utt_lens, response, res_lens)
        return {'valid_loss': loss.item()}

    def sample(self, context, context_lens, utt_lens, n_samples):
        self.utt_encoder.eval()
        self.decoder.eval()
        self.context_encoder.eval()
        src = context.transpose(0,1).transpose(1,2)
        lengths = utt_lens.transpose(0,1)
        maxlen = self.maxlen


        with torch.no_grad():
            turn_size, batch_size = len(src), src[0].size(1)
            outputs = torch.zeros(maxlen, batch_size).to(self.device)
            len_inc = torch.ones((batch_size), dtype=torch.long).to(self.device)
            sample_lens = torch.zeros((batch_size), dtype=torch.long).to(self.device)
            turns = []
            for i in range(turn_size):
                # sbatch = src[i].transpose(0, 1)
                hidden = self.utt_encoder(src[i], lengths[i])
                turns.append(hidden)
            turns = torch.stack(turns)

            context_output, hidden = self.context_encoder(turns)

            output = torch.zeros(batch_size, dtype=torch.long).fill_(self.sos).to(self.device)

            # context multi-head attention
            # context, attn_weight = self.self_attention(turns, turns, turns)

            for t in range(1, maxlen):
                output, hidden = self.decoder(output, hidden, context_output)
                output = torch.max(output, 1)[1]
                outputs[t] = output
                len_inc=len_inc*(output.squeeze()!=EOS_ID).long() # stop increse length (set 0 bit) when EOS is met
                sample_lens=sample_lens+len_inc
        outputs = outputs.transpose(0,1)
#         print(outputs.size())
        outputs = outputs.data.cpu().numpy()
        
        sample_lens = sample_lens.data.cpu().numpy()
        return outputs,sample_lens


from nltk.translate.bleu_score import sentence_bleu
from nltk.translate.bleu_score import SmoothingFunction
from collections import Counter

class Metrics:
    """
    """
    def __init__(self):
        super(Metrics, self).__init__()

    def sim_bleu(self, hyps, ref):
        """
        :param ref - a list of tokens of the reference
        :param hyps - a list of tokens of the hypothesis
    
        :return maxbleu - recall bleu
        :return avgbleu - precision bleu
        """
        scores = []
        for hyp in hyps:
            try:
                scores.append(sentence_bleu([ref], hyp, smoothing_function=SmoothingFunction().method7,
                                        weights=[1./4, 1./4, 1./4, 1./4]))
            except:
                scores.append(0.0)
        return np.max(scores), np.mean(scores)
    
def evaluate(model, metrics, test_loader, vocab, repeat, f_eval):
    ivocab = {v: k for k, v in vocab.items()}
    device = next(model.parameters()).device
    
    recall_bleus, prec_bleus, avg_lens  = [], [], []
        
    dlg_id = 0
    for context, context_lens, utt_lens, floors, response, res_lens in tqdm(test_loader): 
        
        if dlg_id > 500: break
        
#        max_ctx_len = max(context_lens)
        max_ctx_len = context.size(1)
        context, utt_lens, floors = context[:,:max_ctx_len,1:], utt_lens[:,:max_ctx_len]-1, floors[:,:max_ctx_len] 
                         # remove empty utts and the sos token in the context and reduce the context length
        ctx, ctx_lens = context, context_lens
        context, context_lens, utt_lens             = [tensor.to(device) for tensor in [context, context_lens, utt_lens]]

#################################################
        utt_lens[utt_lens<=0]=1
#################################################
        
        with torch.no_grad():
            sample_words, sample_lens = model.sample(context, context_lens, utt_lens, repeat)
        # nparray: [repeat x seq_len]       
        
        pred_sents, _ = indexes2sent(sample_words, vocab)
        pred_tokens = [sent.split(' ') for sent in pred_sents]   
        ref_str, _ =indexes2sent(response[0].numpy(), vocab, SOS_ID)
        #ref_str = ref_str.encode('utf-8')
        ref_tokens = ref_str.split(' ')
        
        max_bleu, avg_bleu = metrics.sim_bleu(pred_tokens, ref_tokens)
        recall_bleus.append(max_bleu)
        prec_bleus.append(avg_bleu)
        
        avg_lens.append(np.mean(sample_lens))

        response, res_lens = [tensor.to(device) for tensor in [response, res_lens]]
        
        ## Write concrete results to a text file
        dlg_id += 1 
        if f_eval is not None:
            f_eval.write("Batch {:d} \n".format(dlg_id))
            # print the context
            start = np.maximum(0, ctx_lens[0]-5)
            for t_id in range(start, ctx_lens[0], 1):
                context_str = indexes2sent(ctx[0, t_id].numpy(), vocab)
                f_eval.write("Context {:d}-{:d}: {}\n".format(t_id, floors[0, t_id], context_str))
            #print the ground truth response    
            f_eval.write("Target >> {}\n".format(ref_str.replace(" ' ", "'")))
            for res_id, pred_sent in enumerate(pred_sents):
                f_eval.write("Sample {:d} >> {}\n".format(res_id, pred_sent.replace(" ' ", "'")))
            f_eval.write("\n")
    prec_bleu= float(np.mean(prec_bleus))
    recall_bleu = float(np.mean(recall_bleus))
    result = {'avg_len':float(np.mean(avg_lens)),
              'recall_bleu': recall_bleu, 'prec_bleu': prec_bleu, 
              'f1_bleu': 2*(prec_bleu*recall_bleu) / (prec_bleu+recall_bleu+10e-12),
             }
    
    if f_eval is not None:
        for k, v in result.items():
            f_eval.write(str(k) + ':'+ str(v)+' ')
        f_eval.write('\n')
    print("Done testing")
    print(result)
    
    return result


import argparse
from datetime import datetime
from tensorboardX import SummaryWriter # install tensorboardX (pip install tensorboardX) before importing this package

def train(args, model=None, pad = 0):
    # LOG #
    fh = logging.FileHandler(f"./output/logs.txt")
                                      # create file handler which logs even debug messages
    logger.addHandler(fh)# add the handlers to the logger
    
    timestamp = datetime.now().strftime('%Y%m%d%H%M')
    tb_writer = SummaryWriter(f"./output/logs/{timestamp}") if args.visual else None

    # Set the random seed manually for reproducibility.
    random.seed(args.seed)
    np.random.seed(args.seed)
    torch.manual_seed(args.seed)
    torch.cuda.manual_seed(args.seed)
    device = torch.device(f"cuda:{args.gpu_id}" if torch.cuda.is_available() else "cpu")
    print(device)


    config=get_config()

    if args.visual:
        json.dump(config, open(f'./output/config_{timestamp}.json', 'w'))# save configs

    ###############################################################################
    # Load data
    ###############################################################################
    data_path = args.data_path+args.dataset+'/'
    train_set = DialogDataset(os.path.join(data_path, 'train.h5'), config['diaglen'], config['maxlen'])
    valid_set = DialogDataset(os.path.join(data_path, 'valid.h5'), config['diaglen'], config['maxlen'])
    test_set = DialogDataset(os.path.join(data_path, 'test.h5'), config['diaglen'], config['maxlen'])
    vocab = load_dict(os.path.join(data_path, 'vocab.json'))
    ivocab = {v: k for k, v in vocab.items()}
    n_tokens = len(ivocab)
    metrics=Metrics()    
    print("Loaded data!")

    ###############################################################################
    # Define the models
    ###############################################################################
    if model is None:
        model = MyModel(config, n_tokens,device)

    if args.reload_from>=0:
        load_model(model, args.reload_from)
        
    model=model.to(device)
    
#     model.init_model() #模型初始化
    
    logger.info("Training...")
    best_perf = -1
    itr_global=1
    start_epoch=1 if args.reload_from==-1 else args.reload_from+1
    for epoch in range(start_epoch, config['epochs']+1):
        epoch_start_time = time.time()
        itr_start_time = time.time()
        
        # shuffle (re-define) data between epochs   
        train_loader=torch.utils.data.DataLoader(dataset=train_set, batch_size=config['batch_size'],
                                                 shuffle=True, num_workers=1, drop_last=True)
        n_iters=train_loader.__len__()
        itr = 1
        for batch in train_loader:# loop through all batches in training data
            model.train()
            context, context_lens, utt_lens, floors, response, res_lens = batch

 #           max_ctx_len = max(context_lens)
            max_ctx_len = context.size(1)
            context, utt_lens = context[:,:max_ctx_len,1:], utt_lens[:,:max_ctx_len]-1
                                    # remove empty utterances in context
                                    # remove the sos token in the context and reduce the context length    
            utt_lens[utt_lens<=0]=1
            batch_gpu = [tensor.to(device) for tensor in [context, context_lens, utt_lens, response, res_lens]] 
            train_results = model.train_batch(*batch_gpu)
                     
            if itr % args.log_every == 0:
                elapsed = time.time() - itr_start_time
                log = '%s|%s@gpu%d epo:[%d/%d] iter:[%d/%d] step_time:%ds elapsed:%s'                %(args.model, args.dataset, args.gpu_id, epoch, config['epochs'],
                         itr, n_iters, elapsed, timeSince(epoch_start_time,itr/n_iters))
                logger.info(log)
                logger.info(train_results)
                if args.visual:
                    tb_writer.add_scalar('train_loss', train_results['train_loss'], itr_global)

                itr_start_time = time.time()    
                
            if itr % args.valid_every == 0 and False:
                logger.info('Validation ')
                valid_loader=torch.utils.data.DataLoader(dataset=valid_set, batch_size=config['batch_size'], shuffle=True, num_workers=1)
                model.eval()    
                valid_losses = []
                for context, context_lens, utt_lens, floors, response, res_lens in valid_loader:
 #                   max_ctx_len = max(context_lens)
                    max_ctx_len = context.size(1)
                    context, utt_lens = context[:,:max_ctx_len,1:], utt_lens[:,:max_ctx_len]-1
                             # remove empty utterances in context
                             # remove the sos token in the context and reduce the context length
                    utt_lens[utt_lens<=0]=1
                    batch = [tensor.to(device) for tensor in [context, context_lens, utt_lens, response, res_lens]]
                    valid_results = model.valid(*batch)    
                    valid_losses.append(valid_results['valid_loss'])
                if args.visual: tb_writer.add_scalar('valid_loss', np.mean(valid_losses), itr_global)
                logger.info({'valid_loss':np.mean(valid_losses)})    
                
            itr += 1
            itr_global+=1            
            
            if itr_global % args.eval_every == 0:  # evaluate the model in the validation set
                model.eval()          
                logger.info("Evaluating in the validation set..")

                valid_loader=torch.utils.data.DataLoader(dataset=valid_set, batch_size=1, shuffle=False, num_workers=1)

                f_eval = open(f"./output/tmp_results/iter{itr_global}.txt", "w")
                repeat = 10            
                eval_results = evaluate(model, metrics, valid_loader, vocab, repeat, f_eval)
                bleu = eval_results['recall_bleu']
                if bleu> best_perf:
                    save_model(model, 0)#itr_global) # save model after each epoch
                if args.visual:
                    tb_writer.add_scalar('recall_bleu', bleu, itr_global)
                
        # end of epoch ----------------------------
               # model.adjust_lr()

    return model


if __name__ == '__main__':

    parser = argparse.ArgumentParser(description='Dialog Pytorch')
    # Path Arguments
    parser.add_argument('--data_path', type=str, default='./data/', help='location of the data corpus')
    parser.add_argument('--model', type=str, default='MyModel', help='model name')
    parser.add_argument('--dataset', type=str, default='dailydialog', help='name of dataset.')
    parser.add_argument('-v','--visual', action='store_true', default=False, help='visualize training status in tensorboard')
    parser.add_argument('--reload_from', type=int, default=-1, help='reload from a trained ephoch')
    parser.add_argument('--gpu_id', type=int, default=1, help='GPU ID')

    # Evaluation Arguments
    parser.add_argument('--log_every', type=int, default=100, help='interval to log autoencoder training results')
    parser.add_argument('--valid_every', type=int, default=1000, help='interval to validation')
    parser.add_argument('--eval_every', type=int, default=500, help='interval to evaluation to concrete results')
    parser.add_argument('--seed', type=int, default=1111, help='random seed')
    
    
    
    
    args = parser.parse_args(args=[])
    print(vars(args))

    # make output directory if it doesn't already exist
    os.makedirs(f'./output/models', exist_ok=True)
    os.makedirs(f'./output/tmp_results', exist_ok=True)
        
    torch.backends.cudnn.benchmark = True # speed up training by using cudnn
    torch.backends.cudnn.deterministic = True # fix the random seed in cudnn
    
    model = train(args)



def test(args):
    conf = get_config()
    # Set the random seed manually for reproducibility.
    random.seed(args.seed)
    np.random.seed(args.seed)
    torch.manual_seed(args.seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed(args.seed)
    else:
        print("Note that our pre-trained models require CUDA to evaluate.")
    
    # Load data
    data_path=args.data_path+args.dataset+'/'
    # data_path=args.data_path+'/'
    test_set=DialogDataset(data_path+'test.h5', conf['diaglen'], conf['maxlen'])
    test_loader=torch.utils.data.DataLoader(dataset=test_set, batch_size=1, shuffle=False, num_workers=1)
    vocab = load_dict(data_path+'vocab.json')
    n_tokens = len(vocab)

    metrics=Metrics()
    
    # Load model checkpoints    
    model = MyModel(conf, n_tokens)
    load_model(model, 0)
    #model=model.to(device)
    model.eval()
    
    f_eval = open("./output/results.txt", "w")
    repeat = args.n_samples
    
    evaluate(model, metrics, test_loader, vocab, repeat, f_eval)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='PyTorch DialogGAN for Eval')
    parser.add_argument('--data_path', type=str, default='./data/', help='location of the data corpus')
    parser.add_argument('--dataset', type=str, default='dailydialog', help='name of dataset, SWDA or DailyDial')
    parser.add_argument('--model', type=str, default='MyModel', help='model name')
    parser.add_argument('--reload_from', type=int, default=0, 
                        help='directory to load models from')
    
    parser.add_argument('--n_samples', type=int, default=10, help='Number of responses to sampling')
    parser.add_argument('--seed', type=int, default=1111, help='random seed')
    args = parser.parse_args(args=[])
    print(vars(args))
    test(args)


# In[ ]:




