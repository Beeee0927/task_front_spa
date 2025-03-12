import { Modal } from 'antd'

export default function UploadModal({
  isModalOpen,
  setIsModalOpen,
  files,
  setFiles
}: any) {
  async function handleUpload() {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.style.display = 'none'
    input.click()
    input.onchange = () => {
      setFiles(files.concat(Array.from(input.files!)))
      input.remove()
      setIsModalOpen(false)
    }
  }

  return (
    <Modal
      title="上传附件"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
      style={{ top: '30%' }}
    >
      <div
        className="w-full h-[200px] mt-4 rounded-md bg-[#F6F7F9] flex flex-col justify-center items-center text-[#555] hover:text-blue-500 hover:cursor-pointer hover:border-blue-500 border-[1px] border-dashed"
        onClick={handleUpload}
      >
        <div className="text-4xl mb-5">+</div>
        <div className="text-sm">点击上传</div>
      </div>
    </Modal>
  )
}
