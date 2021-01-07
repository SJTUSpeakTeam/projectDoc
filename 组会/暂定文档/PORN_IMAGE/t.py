# basic rnn
%reload_ext autoreload
%autoreload 2
from glob import glob
from fastai.vision import *

path = Path('data')
glob(str(path/'*'))

# 检查和删除损坏文件

train_subdirs = glob(str(path/'train/*'))
test_subdirs = glob(str(path/'test/*'))

for subdir in train_subdirs:
    print(subdir)
    verify_images(subdir, delete=True)

for subdir in test_subdirs:
    print(subdir)
    verify_images(subdir, delete=True)
    
data = ImageDataBunch.from_folder(path, 
                                  train='train', 
                                  valid='test',
                                  num_workers=12,
                                  ds_tfms=get_transforms(), 
                                  size=224).normalize(imagenet_stats)
# data.show_batch(rows=4)

learn = cnn_learner(data, models.resnet34, metrics=accuracy)
learn.fit_one_cycle(5)

learn.unfreeze()
learn.fit_one_cycle(5, slice(1e-5,3e-4), pct_start=0.05)

accuracy(*learn.TTA())

learn.save("resnet34_model", return_path=True)

interp = ClassificationInterpretation.from_learner(learn)

interp.plot_confusion_matrix()