import React, { Component } from 'react';
import './style.css'
import ReactDropZone from 'react-dropzone'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import Preview from './PreviewUpload'
import S3FileUpload from 'react-s3';
const fileTypes = [
  "image/apng",
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/pjpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
  "image/x-icon"
];
const config = {
  bucketName: 'wal-bucket',
  region: 'XX',
  accessKeyId: "XX",
  secretAccessKey: "XX",
}
export default class Uploader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      file: '',
      message: '',
      imgfile: '',
      ok: true,
      dimensions: {},
      preview: false,
      button: true,
      crop: {
        unit: "%",
        width: 30,
        aspect: 1 / 1
      },
      setCrop: false
    }
  }

  setDimensions = (e) => {
    this.setState({
      dimensions: {
        height: e.target.offsetHeight,
        width: e.target.offsetWidth
      }
    })
  }
  onImageLoaded = image => {
    this.imageRef = image
  }
  onCropChange = (crop) => {
    this.setState({ crop });
  }
  onCropComplete = crop => {
    if (this.imageRef && crop.width && crop.height) {
      this.getCroppedImg(this.imageRef, crop)
    }
  }
  onSave = () => {
    this.setState({ imgfile: URL.createObjectURL(this.state.cropped) })
    this.setState({ setCrop: false })
  }
  set = () => {
    this.setState({ setCrop: true })
  }
  getCroppedImg(image, crop) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )
    ctx.canvas.toBlob((blob) => {
      this.setState({ croppedurl: blob })
      const file = new File([blob], `cropped.jpg`, {
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      this.setState({ cropped: file })
    }, 'image/jpeg', 1)
    return this.state.croppedurl

  }

  getImage = (e) => {
    this.setState({ imgfile: URL.createObjectURL(e.target.files[0]) })
    if (!this.validFileType(e.target.files[0])) {
      this.setState({ ok: false, message: 'not a valid file type or size is greater than 10mb' })
    }
    else {
      this.setState({ file: e.target.files[0], button: false })
    }
  }

  handlePreviewClick = () => {
    if (this.state.dimensions.height !== 1024 || this.state.dimensions.width !== 1024) {
      this.setState({ message: 'img size does not match 1024 X 1024.please choose another file' })
    }
    else
      this.setState({ preview: true })
  }
  validFileType = (file) => {
    return fileTypes.includes(file.type) && file.size < 10000000;
  }
  upload = () => {
    this.setState({ message: 'Uploading...' })
    S3FileUpload.uploadFile(this.state.cropped, config)
      .then((data) => {
        console.log(data)
        this.setState({ message: 'Uploaded successfully' })
      })
      .catch((err) => {
        console.log(err)
        this.setState({ message: 'Sorry, something went wrong' })
      })
  }
  onDrop = (files) => {
    if (!this.validFileType(files[0])) {
      this.setState({ ok: false, message: 'not a valid file type or size is greater than 10MB' })
    }
    else {
      this.setState({ file: files[0], button: false })
    }
    this.setState({ imgfile: URL.createObjectURL(files[0]) })
  }

  render() {
    return (
      <div>
        {this.state.preview ?
          <Preview fileId={this.state.file} imgfile={this.state.imgfile} />
          : <div className="main">
            <h1>Upload Files To AWS S3</h1>
            <h2>upload an image file:</h2>
            <div >
              <input
                id='upload-image'
                type='file'
                accept='image/*'
                onChange={this.getImage}
              /><br />
              OR<br />
              <br />
              <div className="drop-zone">
                <ReactDropZone onDrop={this.onDrop}>
                  {({ getRootProps }) => (
                    <div {...getRootProps()}>
                      <p>Drop your images here!</p>
                    </div>
                  )}
                </ReactDropZone>
              </div>
              <br />
            </div>
            {this.state.imgfile && <button onClick={this.set}>crop this image</button>}
            {this.state.imgfile && <button onClick={this.handlePreviewClick} disabled={this.state.button}>View image in various sizes to upload</button>}
            <p>{this.state.message}</p>
            {!this.state.setCrop ?
              <div>
                <img src={this.state.imgfile} alt='' onLoad={this.setDimensions} /><br />
                {this.state.imgfile && <button onClick={this.upload}>Upload image</button>}
              </div> :
              <div>
                <div>
                  <button onClick={this.onSave}>Save</button>
                  <br />
                  <ReactCrop
                    src={this.state.imgfile}
                    crop={this.state.crop}
                    onImageLoaded={this.onImageLoaded}
                    onComplete={this.onCropComplete}
                    onChange={this.onCropChange}
                  />
                </div>
              </div>}
          </div>
        }
      </div>
    );
  }
}
