import * as yup from "yup";

export const personalInfoSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  streetAddress: yup.string().required('Street address is required'),
  city: yup.string().required('City is required'),
  region: yup.string().required('State/Province is required'),
  about: yup.string().required('About is required'),
});
