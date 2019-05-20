import React from 'react'
import {Upload, Icon, Modal, message} from 'antd';
import PropTypes from 'prop-types'

import {reqDeleteImg} from '../../api'
import {BASE_IMG_PATH} from '../../utils/constant'

export default class PicturesWall extends React.Component {
  static propTypes = {
    imgs: PropTypes.array
  }

  constructor(props){
    super(props)
    let fileList = []
    const {imgs} = this.props
    if(imgs && imgs.length > 0){
      fileList = imgs.map((img, index) => ({
        uid: -index,
        name: img,
        status: 'done',
        url: BASE_IMG_PATH + img
      }))
    }
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList
    };
  }

  /*
   获取所有已上传图片文件名的数组
   */
  getImgs  = () => {
    
    return this.state.fileList.map(file => file.name)
  }
  /*
   隐藏Modal
   */
  handleCancel = () => this.setState({previewVisible: false});

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = async ({file, fileList}) => {

    if (file.status === 'done') {
      const result = file.response
      if (result.status === 0) {
        message.success('图片上传成功')
        const {url, name} = result.data
        file = fileList[fileList.length - 1]
        file.name = name
        file.url = url
      } else {
        message.error('图片上传失败')
      }
    } else if (file.status === 'removed') {
      const result = await reqDeleteImg(file.name)
      if (result.status === 0) {
        message.success('删除图片成功!')
      } else {
        message.error('删除图片失败!')
      }
    }

    this.setState({fileList})
  };

  render() {
    const {previewVisible, previewImage, fileList} = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload"
          accept='image/*'  /*只接收图片格式*/
          name='image' /*请求参数名*/
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
      </div>
    );
  }
}
