import React, { useState } from "react";
import styles from "../LoanPayment.module.css";

function FilesUpload({
  nextStep,
  prevStep,
  closeModal,
  handleFormData,
  formData,
}) {
  const [filesData, setFilesData] = useState(formData || []); // Initialize with existing files or empty array

  const handleInputChange = (e) => {
    const { type, files: selectedFiles } = e.target;

    if (type === "file") {
      const newFiles = Array.from(selectedFiles); // Convert FileList to array

      const readFiles = newFiles.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              resolve({
                name: file.name,
                size: file.size,
                type: file.type,
                content: event.target.result.split(",")[1], // Base64 content
              });
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file); // Read file as Base64
          })
      );

      Promise.all(readFiles)
        .then((base64Files) => {
          const allFiles = [...filesData, ...base64Files]; // Combine old and new files
          setFilesData(allFiles);
        })
        .catch((err) => console.error("Error reading files:", err));
    }
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = filesData.filter(
      (_, fileIndex) => fileIndex !== index
    );
    setFilesData(updatedFiles);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update parent state with all files
    handleFormData({ files: filesData });
    nextStep(); // Move to the next step after submission
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <button onClick={closeModal} className={styles.closeBtn}>
          X
        </button>
        <h4>Upload Files</h4>
        <div className={styles.inputControl}>
          <label>
            Please upload all required files, including photos/images:
          </label>
          <input
            type="file"
            name="files_upload"
            multiple // Allow multiple file uploads
            onChange={handleInputChange}
          />
        </div>

        {/* Display the list of uploaded files */}
        {filesData.length > 0 && (
          <div className={styles.uploadedFiles}>
            <h5>Uploaded Files:</h5>
            <ul>
              {filesData.map((file, index) => (
                <li key={index} className={styles.fileItem}>
                  {file.name}{" "}
                  <button
                    type="button"
                    className={styles.removeFileBtn}
                    onClick={() => handleRemoveFile(index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.addNavBtnContainer}>
          <button
            type="button"
            className={styles.formNavBtn}
            onClick={prevStep}
          >
            Prev
          </button>
          <button type="submit" className={styles.formNavBtn}>
            Next
          </button>
        </div>
      </form>
    </div>
  );
}

export default FilesUpload;
