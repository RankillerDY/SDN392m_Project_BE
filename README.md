## Giải thích các thư mục:

1. dist: Thư mục chứa các file build
2. src: Thư mục chứa mã nguồn
3. src/constants: Chứa các file chứa các hằng số
4. src/middlewares: Chứa các file chứa các hàm xử lý middleware, như validate, check token, ...
5. src/controllers: Chứa các file nhận request, gọi đến service để xử lý logic nghiệp vụ, trả về response
6. src/services: Chứa các file chứa method gọi đến database để xử lý logic nghiệp vụ
7. src/models: Chứa các file chứa các model
8. src/routes: Chứa các file chứa các route
9. src/utils: Chứa các file chứa các hàm tiện ích, như mã hóa, gửi email, ...

## 🥈Cài đặt các package config cần thiết còn lại

1. eslint: Linter (bộ kiểm tra lỗi) chính
2. prettier: Code formatter chính
3. eslint-config-prettier: Cấu hình ESLint để không bị xung đột với Prettier
4. eslint-plugin-prettier: Dùng thêm một số rule prettier cho eslint
5. @typescript-eslint/eslint-plugin: ESLint plugin cung cấp các rule cho Typescript
6. @typescript-eslint/parser: Parser cho phép ESLint kiểm tra lỗi Typescript
7. ts-node: Dùng để chạy TypeScript code trực tiếp mà không cần build
8. tsc-alias: Xử lý alias khi build
9. tsconfig-paths: Khi setting alias import trong dự án dùng ts-node thì chúng ta cần dùng tsconfig-paths để 10. nó hiểu được paths và baseUrl trong file tsconfig.json
10. rimraf: Dùng để xóa folder dist khi trước khi build
11. nodemon: Dùng để tự động restart server khi có sự thay đổi trong code

## 🥇Câu lệnh để chạy dự án

### 🥈Chạy dự án trong môi trường dev

`npm run dev`

### 🥈Build dự án TypeScript sang JavaScript cho production

- Có thể các bạn sẽ hỏi rằng tại sao phải build, để nguyên TypeScript thì luôn vẫn được mà. Đúng vậy nhưng khi build thì chúng ta sẽ có những lợi ích sau

1. Code chạy được mà không cần cài đặt TypeScript
2. Chạy nhanh hơn vì đã được biên dịch rồi
3. Có thể minify code để giảm dung lượng
4. Code chạy được trên những mội trường không hỗ trợ TypeScript

- Để build thì chạy câu lệnh sau
  `npm run build`
  `npm run start`

### 🥈Kiểm tra lỗi ESLint / Prettier

`npm run lint`
`npm run lint:fix`
`npm run prettier`

## 🥇Một số lưu ý

### 🥈Lưu ý cài thêm gói @types/ten-thu-vien nếu cần

- Vì đây là dự án chạy với Typescript nên khi cài đặt bất cứ một thư viện này chúng ta nên xem thư viện đó có hỗ trợ TypeScript không nhé. Có một số thư viện ở npm hỗ trợ TypeScript sẵn, có một số thì chúng ta phải cài thêm bộ TypeScript của chúng qua @types/ten-thu-vien
- Ví dụ như express thì chúng ta cài như sau
  `npm i express
npm i @types/express -D`

### 🥈 Môi trường test database (MongoDB) :
mongodb+srv://unicourse:15012024@cluster0.905oy7i.mongodb.net/unicourse_db
### 🥈 Môi trường test POSTMAN qua URI:
https://martian-moon-288478.postman.co/workspace/UniCourse~69126b18-7984-4a12-b895-227b879e611a/collection/27218541-246309b7-8786-4722-93d8-87df5db1bca4?action=share&creator=27218541
