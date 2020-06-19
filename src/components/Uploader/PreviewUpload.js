import React, { Component } from 'react'
import Main from './BasicUpload'
import S3FileUpload from 'react-s3';
import './style.css'
const config = {
  bucketName: 'wal-bucket',
  region: 'XX',
  accessKeyId: "XX",
  secretAccessKey: "XX"

}
export default class Preview extends Component {
  state = {
    src1: URL.createObjectURL(this.props.fileId),
    goback: false,
    file1: '',
    file2: '',
    file3: '',
    file4: '',
    message: ''
  }
  clickRecurse = () => {
    this.handleView4(755, 450, 'file1')
    this.handleView4(365, 450, 'file2')
    this.handleView4(365, 212, 'file3')
    this.handleView4(380, 380, 'file4')
  }
  handleView4 = (width, height, filename) => {
    const img1 = new Image();
    img1.src = this.props.imgfile
    const elem1 = document.createElement('canvas');
    elem1.width = width;
    elem1.height = height;
    const ctx1 = elem1.getContext('2d')
    ctx1.drawImage(img1, 0, 0, width, height);
    ctx1.canvas.toBlob((blob) => {
      const file = new File([blob], `${filename}.jpg`, {
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      console.log(file)
      this.setState({
        ...this.state,
        [filename]: file,
      })
    }, 'image/jpeg', 1);
  }
  async upload() {
    this.setState({ message: 'Uploading...' })
    try {
      await S3FileUpload.uploadFile(this.state.file1, config)
      await S3FileUpload.uploadFile(this.state.file2, config)
      await S3FileUpload.uploadFile(this.state.file3, config)
      await S3FileUpload.uploadFile(this.state.file4, config)
    }
    catch (err) {
      console.log(err)
      this.setState({ message: 'Something went wrong' })
    }
    this.setState({ message: 'Uploaded !' })
  }

  back = () => {
    this.setState({ goback: true })
  }
  render() {

    return (
      <div>
        {
          this.state.goback ? <Main /> : <div>
            <button onClick={this.back}>Back</button><br />
            <button onClick={this.clickRecurse}>Compress images based on below sizes</button><br />
            <button onClick={() => this.upload()}>Upload All</button>
            <p>{this.state.message}</p>
            <label>Horizontal:755x450<br /><img src={this.state.src1} className="view1" alt='' /><br /></label>
            <label>Vertical:365x450<br /><img src={this.state.src1} className="view2" alt='' /><br /></label>
            <label>Horizontal small:365x212<br /><img src={this.state.src1} className="view3" alt='' /><br /></label>
            <label>gallery:380x380<br /><img src={this.state.src1} className="view4" alt='' /></label>
          </div>
        }
      </div >
    )
  }
}
