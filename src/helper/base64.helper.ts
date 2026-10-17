export const toBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("File is null or undefined.");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      resolve(reader.result);
    });
    reader.addEventListener("error", (error) => {
      reject(error);
    });
    reader.readAsDataURL(file);
  });
};

export const base64Values = (file: Blob, name: any) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("File is empty or invalid");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result;
      const value = { [name]: base64String };
      resolve(value[name]);
    };

    reader.onerror = () => {
      reject("Error reading the file");
    };

    reader.readAsDataURL(file);
  });
};
