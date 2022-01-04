Tiểu Luận Chuyên Ngành (CLC) 

Đề tài: Xây dựng website quản lí phòng khám nha khoa

Nhóm sinh viên thực hiện:

  - Phan Văn Kỷ - 18110138
  
  - Vũ Nhật Khanh - 18110135

Cài đặt:

*Cài đặt dự án

  - Bước 1: Tạo thư mục clone_project (tên thư mục tùy ý)
 
  - Bước 2: cd clone_project
  
  - Bước 3: git clone https://github.com/khanhvu145/dental_clinic.git
  
  - Bước 4: cd dental_clinic
  
  - Bước 5: npm install
  
  - Bước 6: npm start (localhost:3000)

*Cài đặt database

 - Bước 1: Tải/cài đặt mongodb compass

 - Bước 2: Tải/giải nén các collections tại: https://drive.google.com/file/d/1TK9OoNYR5GZiibS2GMeeubaPPWo0cmdw/view?usp=sharing 

 - Bước 3: Mở mongdb compass, tạo database

 - Bước 4: Import các file collection vào database mới tạo

 - Bước 5: Ở trong thư mục dự án vào src/config/db/index.js, sửa dòng mongoose.connect thành đường dẫn kết nối database trên mongodb compass (vd: mongodb://localhost:27017/myDB)
