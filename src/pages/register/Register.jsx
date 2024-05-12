import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ProgressBar from "react-bootstrap/ProgressBar"; // Import ProgressBar
import { storage } from "../../../src/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { makeRequest } from "../../axios";
import logo from '../../../src/assets/logo-1.jpg';

import "./register.scss";

const Register = () => {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [err, setErr] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // State for upload progress
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileError("");
    }
  };

  const handleCloseUploadModal = () => setShowUploadModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    let validationErrors = {};

    // Validate fields (username, email, password, name)
    for (const field in inputs) {
      if (!inputs[field].trim()) {
        validationErrors[field] = `Please enter your ${field}.`;
      }
    }

    // Validate profile picture
    if (!file) {
      validationErrors.profilePic = "Please select a profile picture.";
    } else {
      const allowedExtensions = ["png", "jpeg", "jpg"];
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        setFileError("Only .png, .jpeg, and .jpg files are allowed.");
        validationErrors.profilePic = "";
      }
    }

    // Set errors state with validation errors
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Show upload modal and upload profile picture
    setShowUploadModal(true);
  };

  const handleRegister = async () => {
    try {
      // Upload profile picture to Firebase Storage
      const imgUrl = await uploadProfilePicture();

      // Register user with profile picture URL
      const userData = {
        username: inputs.username,
        email: inputs.email,
        password: inputs.password,
        name: inputs.name,
        profilePic: imgUrl,
      };

      await makeRequest.post("/auth/register", userData);
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.status === 409) {
        alert("User already exists!");
      } else {
        console.error("Registration failed:", err);
        setErr("Registration failed. Please try again later.");
      }
    }
  };

  const uploadProfilePicture = async () => {
    try {
      const uniqueFilename = `${uuidv4()}_${file.name}`;
      const storageRef = ref(storage, `images/${uniqueFilename}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Monitor the state of the upload task
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // You can optionally track upload progress here
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress); // Update upload progress state
        },
        (error) => {
          // Handle any errors during the upload
          console.error("Upload failed:", error);
          throw error;
        },
        () => {
          // Handle successful upload completion
        }
      );

      // Wait for the upload task to complete
      await uploadTask;

      // Get the download URL for the uploaded file
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      return downloadURL;
    } catch (err) {
      console.error("Upload failed:", err);
      throw err;
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Pocket Donation Bank</h1>
          <p>
          “It’s easier to take than to give. It’s nobler to give than to take. The thrill of taking lasts a day. The thrill of giving lasts a lifetime" <br />
          -Joan Marques
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <div className="d-flex justify-content-between align-items-center">
            <h1>Register</h1>
            <img src={logo} alt=""  width={250} height={250} className="bg-danger"/>
          </div>
          <form>
            <input type="text" placeholder="Username" name="username" onChange={handleChange} />
            {formSubmitted && errors.username && <p className="text-danger">{errors.username}</p>}
            <input type="email" placeholder="Email" name="email" onChange={handleChange} />
            {formSubmitted && errors.email && <p className="text-danger">{errors.email}</p>}
            <input type="password" placeholder="Password" name="password" onChange={handleChange} />
            {formSubmitted && errors.password && <p className="text-danger">{errors.password}</p>}
            <input type="text" placeholder="Name" name="name" onChange={handleChange} />
            {formSubmitted && errors.name && <p className="text-danger">{errors.name}</p>}
            {/* Add file input for profile picture */}
            <Form.Control
              className="mt-3"
              type="file"
              placeholder="upload"
              onChange={handleFileChange}
            />
            {fileError && <p className="text-danger">{fileError}</p>}
            {formSubmitted && errors.profilePic && <p className="text-danger">{errors.profilePic}</p>}
            {err && <p className="text-danger">{err}</p>}
            <Button onClick={handleSubmit}>Register</Button>
          </form>
        </div>
      </div>
      {/* Upload modal */}
      <Modal show={showUploadModal} onHide={handleCloseUploadModal}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Profile Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Display progress bar for upload progress */}
          <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUploadModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleRegister}>
            Register
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Register;
