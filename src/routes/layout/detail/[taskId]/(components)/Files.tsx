import { downloadFile } from '@/routes/api'
import { useLocalStore } from '@/store'
import { CloseOutlined } from '@ant-design/icons'
import { Button, Modal } from 'antd'

export default function Files({ setIsModalOpen, files, setFiles }: any) {
  const { role } = useLocalStore()
  const isAdmin = role === 'admin'

  return (
    <div className="flex mt-4">
      {!isAdmin && (
        <Button
          id="xxx"
          type="primary"
          size="large"
          className="w-40 mr-2"
          onClick={() => setIsModalOpen(true)}
        >
          上传附件
        </Button>
      )}
      <div className="flex flex-wrap">
        {files?.map(({ name }: any, idx: number) => (
          <div
            title={name}
            className="w-40 h-10 text-center leading-10 p-0 px-3 bg-white rounded-md mr-2 mb-2 text-sm flex items-center justify-between hover:cursor-pointer "
            key={idx}
            onClick={() => {
              const a = document.createElement('a')
              a.style.display = 'none'
              a.target = '_blank'
              a.href = URL.createObjectURL(files[idx])
              document.body.appendChild(a)
              a.click()
              URL.revokeObjectURL(a.href)
              document.body.removeChild(a)
            }}
          >
            <div className="whitespace-nowrap overflow-hidden text-ellipsis mr-2">
              {name}
            </div>
            {!isAdmin && (
              <CloseOutlined
                className="hover:text-blue-500"
                onClick={(e) => {
                  e.stopPropagation()
                  Modal.confirm({
                    title: '删除附件',
                    content: '确定删除该附件吗',
                    onOk: () => {
                      setFiles(files.filter((_: any, i: number) => i !== idx))
                    },
                    icon: null,
                    style: { top: '30%' }
                  })
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
