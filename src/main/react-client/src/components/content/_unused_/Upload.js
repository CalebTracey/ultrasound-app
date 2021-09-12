/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import UploadService from '../../../service/file-service';

const { upload } = UploadService;

const getColor = (props) => {
  if (props.isDragAccept) {
    return '#00e676';
  }
  if (props.isDragReject) {
    return '#ff1744';
  }
  if (props.isDragActive) {
    return '#2196f3';
  }
  return '#eeeeee';
};

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
`;

const Dropzone = ({ setFiles, setIsLoading }) => {
  // const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles) {
        setIsLoading(true);
        acceptedFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onabort = () => console.log('file reading was aborted');
          reader.onerror = () => console.log('file reading has failed');
          reader.onload = () => {};
          reader.readAsArrayBuffer(file);
        });
        setFiles(acceptedFiles);
      }
      return () => setIsLoading(false);
    },
    [setFiles, setIsLoading]
  );
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop, accept: 'video/mp4' });

  return (
    <div
      style={{
        display: 'flex',
        marginTop: 'auto',
        marginBottom: 'auto',
        flexDirection: 'column',
        margin: 'auto',
      }}
    >
      <div className="container">
        <Container
          {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
        >
          <input {...getInputProps()} {...onDrop()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </Container>
      </div>
    </div>
  );
};

export default Dropzone;
