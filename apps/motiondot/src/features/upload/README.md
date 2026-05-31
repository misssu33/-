# upload feature

`react-dropzone` 기반 다중 비디오 드래그앤드롭 업로드.
multipart POST → `storage/uploads/{batchId}` 저장.
API Route는 `upload-handler`만 호출합니다.
