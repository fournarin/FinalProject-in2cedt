const fs = require('fs');
const path = require('path');

const storagePath = path.join(__dirname, '../../uploads');

// Ensure the storage directory exists
if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath, { recursive: true });
}

/**
 * Save a file to the storage directory
 * @param {string} filename - The name of the file to save
 * @param {Buffer} data - The file data
 * @returns {Promise<string>} - The path to the saved file
 */
const saveFile = (filename, data) => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(storagePath, filename);
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                return reject(err);
            }
            resolve(filePath);
        });
    });
};

/**
 * Retrieve a file from the storage directory
 * @param {string} filename - The name of the file to retrieve
 * @returns {Promise<Buffer>} - The file data
 */
const getFile = (filename) => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(storagePath, filename);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
};

/**
 * Delete a file from the storage directory
 * @param {string} filename - The name of the file to delete
 * @returns {Promise<void>}
 */
const deleteFile = (filename) => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(storagePath, filename);
        fs.unlink(filePath, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
};

module.exports = {
    saveFile,
    getFile,
    deleteFile,
};