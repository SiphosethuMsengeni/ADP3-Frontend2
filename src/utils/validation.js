// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

export const validatePrice = (price) => {
  return !isNaN(price) && parseFloat(price) >= 0;
};

export const validateISBN = (isbn) => {
  const isbnRegex = /^(?:ISBN(?:-1[03])?:? ?)?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/;
  return isbnRegex.test(isbn.replace(/[\s-]/g, ''));
};

// Form validation
export const validateUserForm = (formData) => {
  const errors = {};

  if (!validateRequired(formData.userFirstName)) {
    errors.userFirstName = 'First name is required';
  }

  if (!validateRequired(formData.userLastName)) {
    errors.userLastName = 'Last name is required';
  }

  if (!validateRequired(formData.userEmail)) {
    errors.userEmail = 'Email is required';
  } else if (!validateEmail(formData.userEmail)) {
    errors.userEmail = 'Please enter a valid email address';
  }

  if (!validateRequired(formData.userPassword)) {
    errors.userPassword = 'Password is required';
  } else if (!validatePassword(formData.userPassword)) {
    errors.userPassword = 'Password must be at least 6 characters long';
  }

  if (!validateRequired(formData.userPhoneNumber)) {
    errors.userPhoneNumber = 'Phone number is required';
  } else if (!validatePhone(formData.userPhoneNumber)) {
    errors.userPhoneNumber = 'Please enter a valid phone number';
  }

  return errors;
};

export const validateBookForm = (formData) => {
  const errors = {};

  if (!validateRequired(formData.bookTitle)) {
    errors.bookTitle = 'Book title is required';
  }

  if (!validateRequired(formData.bookAuthor)) {
    errors.bookAuthor = 'Author is required';
  }

  if (!validateRequired(formData.bookISBN)) {
    errors.bookISBN = 'ISBN is required';
  } else if (!validateISBN(formData.bookISBN)) {
    errors.bookISBN = 'Please enter a valid ISBN';
  }

  if (!validateRequired(formData.bookPrice)) {
    errors.bookPrice = 'Price is required';
  } else if (!validatePrice(formData.bookPrice)) {
    errors.bookPrice = 'Please enter a valid price';
  }

  if (!validateRequired(formData.bookGenre)) {
    errors.bookGenre = 'Genre is required';
  }

  return errors;
};

export const validateLoginForm = (formData) => {
  const errors = {};

  if (!validateRequired(formData.email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!validateRequired(formData.password)) {
    errors.password = 'Password is required';
  }

  return errors;
};