import { useState } from "react";
import type { SignupFormData } from "@/features/auth/types/auth-types";

export function useValidateEmail() {
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  return { validateEmail };
}

export function useValidatePassword() {
  const validatePassword = (password: string) => {
    return password.length >= 8 && /^(?=.*[A-Za-z])(?=.*\d)/.test(password);
  };
  return { validatePassword };
}

export function useValidateNickname() {
  const validateNickname = (nickname: string) => {
    return nickname.length >= 2 && nickname.length <= 20;
  };
  return { validateNickname };
}

export function useValidateStep() {
  const { validateEmail } = useValidateEmail();
  const { validatePassword } = useValidatePassword();
  const { validateNickname } = useValidateNickname();

  const validateStep = (step: number, formData: SignupFormData) => {
    switch (step) {
      case 1:
        return (
          validateEmail(formData.email) &&
          validatePassword(formData.password) &&
          formData.password === formData.confirmPassword
        );
      case 2:
        return validateNickname(formData.nickname) && !!formData.region;
      case 3:
        return true; // Optional step, always valid for progression
      case 4:
        return true; // Optional step, always valid for progression
      default:
        return false;
    }
  };
  return { validateStep };
}
