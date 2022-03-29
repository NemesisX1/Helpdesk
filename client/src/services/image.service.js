import axios from 'axios';
import { BaseService } from './base.service';


class ImageService extends BaseService {
   async  uploadFile(file) {
        const url = `https://api.cloudinary.com/v1_1/nemesisx1/upload`;
        const fd = new FormData();
    
        fd.append(
          "upload_preset",
          'msywympw'
        );
        fd.append("tags", "browser_upload");
        fd.append("file", file);
        
        const response = await axios.post(url, fd, {
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            }
        });

        console.log(response.data);
        return response.data.secure_url;
      }
}

export default ImageService