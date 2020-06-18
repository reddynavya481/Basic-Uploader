import React, { Component } from 'react'
import Main from './BasicUpload'
import S3FileUpload from 'react-s3';
import './style.css'
const config = {
  bucketName: 'wal-bucket',
  region: 'us-east-1',
  accessKeyId: "AKIAJ33FW7SSUJQ7GYWA",
  secretAccessKey: "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",
}
export default class Preview extends Component {
  state = {
    src1: URL.createObjectURL(this.props.fileId),
    goback: false,
    file1: '',
    file2: '',
    file3: '',
    file4: '',
    ok1: false,
    ok2: false,
    ok3: false,
    ok4: false,
    message: ''
  }

  handleView4 = () => {
    const img1 = new Image();
    img1.src = this.props.imgfile
    const elem1 = document.createElement('canvas');
    elem1.width = 755;
    elem1.height = 450;
    const ctx1 = elem1.getContext('2d')
    ctx1.drawImage(img1, 0, 0, 755, 450);
    ctx1.canvas.toBlob((blob) => {
      const file = new File([blob], this.props.fileId.name, {
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      console.log(file)
      this.setState({ file1: file })
    }, 'image/jpeg', 1);

    const img2 = new Image();
    img2.src = this.props.imgfile
    const elem2 = document.createElement('canvas');
    elem2.width = 365;
    elem2.height = 450;
    const ctx2 = elem2.getContext('2d')
    ctx2.drawImage(img2, 0, 0, 365, 450);
    ctx2.canvas.toBlob((blob) => {
      const file = new File([blob], `${this.props.fileId.name}1`, {
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      console.log(file)
      this.setState({ file2: file })
    }, 'image/jpeg', 1);

    const img3 = new Image();
    img3.src = this.props.imgfile
    const elem3 = document.createElement('canvas');
    elem3.width = 365;
    elem3.height = 212;
    const ctx3 = elem3.getContext('2d')
    ctx3.drawImage(img3, 0, 0, 365, 212);
    ctx3.canvas.toBlob((blob) => {
      const file = new File([blob], `${this.props.fileId.name}2`, {
        type: 'image/jpeg',
        lastModified: Date.now()
      }); //output image as a file
      console.log(file)
      this.setState({ file3: file })
    }, 'image/jpeg', 1);

    const img4 = new Image();
    img4.src = this.props.imgfile
    const elem4 = document.createElement('canvas');
    elem4.width = 380;
    elem4.height = 380;
    const ctx4 = elem4.getContext('2d')
    ctx4.drawImage(img1, 0, 0, 755, 450);
    ctx4.canvas.toBlob((blob) => {
      const file = new File([blob], `${this.props.fileId.name}3`, {
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      console.log(file)
      this.setState({ file4: file })
    }, 'image/jpeg', 1);
  }
  upload = () => {
    this.setState({ message: 'Uploading...' })
    S3FileUpload.uploadFile(this.state.file1, config)
      .then((data) => {
        console.log(data)
        console.log('upload1')
        this.setState({ ok1: true })
      })
      .catch((err) => {
        console.log(err)
        this.setState({ message: 'Sorry, something went wrong while uploading file1' })
      })
    S3FileUpload.uploadFile(this.state.file2, config)
      .then((data) => {
        console.log(data)
        console.log('upload2')
        this.setState({ ok2: true })
      })
      .catch((err) => {
        console.log(err)
        this.setState({ message: 'Sorry, something went wrong while uploading file2' })
      })
    S3FileUpload.uploadFile(this.state.file3, config)
      .then((data) => {
        console.log(data)
        console.log('upload3')
        this.setState({ ok3: true })
      })
      .catch((err) => {
        console.log(err)
        this.setState({ message: 'Sorry, something went wrong while uploading file3' })
      })
    S3FileUpload.uploadFile(this.state.file4, config)
      .then((data) => {
        console.log(data)
        console.log('upload4')
        this.setState({ ok4: true })
      })
      .catch((err) => {
        this.setState({ message: 'Sorry, something went wrong while uploading file4' })
      })
    if (this.state.ok1 && this.state.ok2 && this.state.ok3 && this.state.ok4)
      this.setState({ message: 'Upload Successful' })
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
            <button onClick={() => this.handleView4()}>Compress images based on below sizes</button><br />
            <button onClick={this.upload}>Upload All</button>
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
