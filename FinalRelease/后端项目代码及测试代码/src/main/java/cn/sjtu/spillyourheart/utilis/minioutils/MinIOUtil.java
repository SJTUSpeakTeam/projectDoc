package cn.sjtu.spillyourheart.utilis.minioutils;

import cn.sjtu.spillyourheart.utilis.httputils.HttpUtils;
import cn.sjtu.spillyourheart.utilis.msgutils.Msg;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgCode;
import cn.sjtu.spillyourheart.utilis.msgutils.MsgUtil;
import io.minio.*;
import net.sf.json.JSONObject;
import org.apache.http.HttpResponse;
import org.apache.http.util.EntityUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

public class MinIOUtil {
    static public Msg upload(MultipartFile file){
        String message;
        String bucketName = "product";
        String serviceUrl = "http://10.103.243.11:9000";
        String serverUrl = "http://202.120.40.8:30399";
        MinioClient minioClient =
                MinioClient.builder()
                        .endpoint(serviceUrl)
                        .credentials("AKIAIOSFODNN7EXAMPLE", "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY")
                        .build();
        // specify the file is null
        if (null == file || 0 == file.getSize()) {
            message = "上传文件不能为空";
            System.out.println("[ERROR] MinIOUtil: upload a empty file");
            return MsgUtil.makeMsg(MsgCode.ERROR, message);
        }
        // fileName = timestamp_originalFilename
        String originalFilename = file.getOriginalFilename();
        System.out.println("originalFilename: " + originalFilename);
        String filePrefix = System.currentTimeMillis() + originalFilename;
        System.out.println("filePrefix: " + filePrefix);
        String fileName = filePrefix + ".jpg";
        System.out.println("filename: " + fileName);
        //String suffix = originalFilename.substring(originalFilename.lastIndexOf("."));
        System.out.println("test14");
        try {System.out.println("test15");
            // specify bucket existence
            boolean isExist = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (isExist) {
                System.out.println("[INFO] MinIOUtil: Bucket already exists.");
            }
            else {
                System.out.println("[INFO] MinIOUtil: Init Bucket: product.");
                minioClient.makeBucket(MakeBucketArgs.builder()
                        .bucket(bucketName)
                        .build());
            }

            // handle MultipartFile to File
            InputStream inputStream;
            File true_file = null;
            true_file = File.createTempFile(filePrefix, ".jpg");
            file.transferTo(true_file);   //sourceFile为传入的MultipartFile
            fileName = true_file.getName();
            System.out.println("true_file.getName(): " + fileName);
            System.out.println(true_file.getPath());
            inputStream = new FileInputStream(true_file);
            true_file.deleteOnExit();

            // put object into object
            minioClient.putObject(PutObjectArgs.builder().bucket(bucketName).object(fileName).stream(
                    inputStream, -1, 10485760)
                    .build());

            // download_link = host/bucketName/fileName
            String downLoadLink;
            downLoadLink = serverUrl + "/" + bucketName + "/" + fileName;
            System.out.println("link:" + downLoadLink);
            JSONObject jsonObject = new JSONObject();
            return MsgUtil.makeMsg(MsgCode.SUCCESS, "pic into MinIO");
        }
        catch (Exception e){
            System.out.println("[ERROR] MinIOUtil: Can't handle bucket: product");
            e.printStackTrace();
            return MsgUtil.makeMsg(MsgCode.ERROR, MsgUtil.ERROR_MSG);
        }
    }
}
