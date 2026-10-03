function isValidStudentNumber(value) {
  return typeof value === "string" && /^24-\d{4}-\d{2}$/.test(value);
}

function isValidPassword(value) {
  if (typeof value !== "string") return false;
  return /^(?=\S{8,}$)(?=.*[A-Z])(?=.*\d)(?=.*[@$!]).*$/.test(value);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { isValidStudentNumber, isValidPassword };
}

if (typeof document !== "undefined") {
  const form = document.getElementById("registrationForm");
  const fullName = document.getElementById("fullName");
  const studentNumber = document.getElementById("studentNumber");
  const email = document.getElementById("email");
  const mobileNumber = document.getElementById("mobileNumber");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const course = document.getElementById("course");
  const terms = document.getElementById("terms");
  const successMessage = document.getElementById("successMessage");
  const registrationSummary = document.getElementById("registrationSummary");

  const fields = {
    fullName: {input: fullName, error: document.getElementById("fullNameError")},
    studentNumber: {input: studentNumber, error: document.getElementById("studentNumberError")},
    email: {input: email, error: document.getElementById("emailError")},
    mobileNumber: {input: mobileNumber, error: document.getElementById("mobileNumberError")},
    password: {input: password, error: document.getElementById("passwordError")},
    confirmPassword: {input: confirmPassword, error: document.getElementById("confirmPasswordError")},
    course: {input: course, error: document.getElementById("courseError")},
    terms: {input: terms, error: document.getElementById("termsError")}
  };

  function setError(name, message) {
    fields[name].error.textContent = message;
    fields[name].input.classList.add("input-invalid");
    fields[name].input.classList.remove("input-valid");
    fields[name].input.setAttribute("aria-invalid", "true");
  }

  function clearError(name) {
    fields[name].error.textContent = "";
    fields[name].input.classList.remove("input-invalid");
    fields[name].input.classList.add("input-valid");
    fields[name].input.setAttribute("aria-invalid", "false");
  }

  function resetFieldState(name) {
    fields[name].error.textContent = "";
    fields[name].input.classList.remove("input-invalid","input-valid");
    fields[name].input.setAttribute("aria-invalid", "false");
  }

  function validateFullName() {
    const value = fullName.value.trim();
    if (value.length < 2) { setError("fullName","Enter at least 2 characters for the full name."); return false; }
    clearError("fullName"); return true;
  }

  function validateStudentNumber() {
    const value = studentNumber.value.trim();
    if (!isValidStudentNumber(value)) { setError("studentNumber","Enter a student number in the format 24-1234-12."); return false; }
    clearError("studentNumber"); return true;
  }

  function validateEmail() {
    const value = email.value.trim();
    const pattern = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/;
    if (!pattern.test(value)) { setError("email","Enter a valid email address."); return false; }
    clearError("email"); return true;
  }

  function validateMobileNumber() {
    const value = mobileNumber.value.trim();
    const pattern = /^(?:09\d{9}|\+639\d{9})$/;
    if (!pattern.test(value)) { setError("mobileNumber","Use 09 followed by nine digits or +639 followed by nine digits."); return false; }
    clearError("mobileNumber"); return true;
  }

  function validatePassword() {
    if (!isValidPassword(password.value)) {
      setError("password","Password must have at least 8 characters, one uppercase letter, one digit, one of @, $, or !, and no spaces.");
      return false;
    }
    clearError("password"); return true;
  }

  function updatePasswordFeedback() {
    const feedback = document.getElementById("passwordFeedback");
    if (!password.value) { feedback.textContent=""; feedback.className="feedback"; return; }
    if (isValidPassword(password.value)) {
      feedback.textContent="Password meets all requirements.";
      feedback.className="feedback valid";
    } else {
      feedback.textContent="Use 8+ characters, an uppercase letter, a number, @/$/!, and no spaces.";
      feedback.className="feedback invalid";
    }
  }

  function validateConfirmPassword() {
    if (!confirmPassword.value || confirmPassword.value !== password.value) {
      setError("confirmPassword","Passwords must match exactly."); return false;
    }
    clearError("confirmPassword"); return true;
  }

  function validateCourse() {
    if (!["BSIT","BSCS"].includes(course.value)) {
      setError("course","Please select BSIT or BSCS."); return false;
    }
    clearError("course"); return true;
  }

  function validateTerms() {
    if (!terms.checked) { setError("terms","You must agree to the terms and conditions."); return false; }
    clearError("terms"); return true;
  }

  function validateAll() {
    return [
      validateFullName(), validateStudentNumber(), validateEmail(),
      validateMobileNumber(), validatePassword(), validateConfirmPassword(),
      validateCourse(), validateTerms()
    ].every(Boolean);
  }

  function displaySummary() {
    document.getElementById("summaryName").textContent = fullName.value.trim();
    document.getElementById("summaryStudentNumber").textContent = studentNumber.value.trim();
    document.getElementById("summaryEmail").textContent = email.value.trim();
    document.getElementById("summaryMobileNumber").textContent = mobileNumber.value.trim();
    document.getElementById("summaryCourse").textContent = course.value;
    successMessage.textContent = "Registration details validated successfully!";
    successMessage.classList.add("visible");
    registrationSummary.classList.add("visible");
  }

  function clearOutput() {
    successMessage.textContent = "";
    successMessage.classList.remove("visible");
    registrationSummary.classList.remove("visible");
    ["summaryName","summaryStudentNumber","summaryEmail","summaryMobileNumber","summaryCourse"]
      .forEach(id => document.getElementById(id).textContent = "");
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    clearOutput();
    if (validateAll()) displaySummary();
  });

  password.addEventListener("input", () => {
    updatePasswordFeedback();
    if (password.value) validatePassword(); else resetFieldState("password");
  });

  fullName.addEventListener("blur", validateFullName);
  course.addEventListener("change", validateCourse);
  terms.addEventListener("change", validateTerms);

  confirmPassword.addEventListener("input", () => {
    if (confirmPassword.value) validateConfirmPassword();
    else resetFieldState("confirmPassword");
  });

  form.addEventListener("reset", () => {
    setTimeout(() => {
      Object.keys(fields).forEach(resetFieldState);
      const feedback = document.getElementById("passwordFeedback");
      feedback.textContent = "";
      feedback.className = "feedback";
      clearOutput();
    }, 0);
  });
}