function validateEmail(email) {
  if (!email) {
    return 'Email is required.';
  }
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email) ? undefined : 'Email is invalid.';
}

function validateRequired(value, field) {
  return value ? undefined : `${field} is required.`;
}

export default { email: validateEmail, required: validateRequired };
