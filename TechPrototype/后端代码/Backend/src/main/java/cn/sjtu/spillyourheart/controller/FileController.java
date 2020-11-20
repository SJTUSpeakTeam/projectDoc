package cn.sjtu.spillyourheart.controller;

import cn.sjtu.spillyourheart.utilis.jwtutils.token.PassToken;
import cn.sjtu.spillyourheart.utilis.minioutils.MinIOUtil;
import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgCode;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgUtil;
import net.sf.json.JSONObject;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin
@RestController
@RequestMapping("/file")
public class FileController {

    @PassToken
    @RequestMapping("/upload")
    public Msg upload(@RequestParam("file") MultipartFile multipartFile) {
        // store file into OSS
        try {
            return MinIOUtil.upload(multipartFile);
        } catch (Exception e) {
            System.out.println("[ERROR] FileController: unknown exception during upload");
            e.printStackTrace();
            return MsgUtil.makeMsg(MsgCode.ERROR, MsgUtil.ERROR_MSG);
        }
    }

    @GetMapping("/get/{filename:.+}")
    @ResponseBody
    @PassToken
    public Msg getFile(@PathVariable String filename) {
//        Resource file = storageService.load(filename);
        return null;
    }
}
