import React, { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { signupApi } from "./api/UserApiService";
import { useNavigate } from "react-router-dom";
import { SignUpFormValues } from "../types/types";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const initialValues = {
    username: "",
    password: "",
    isAdmin: false,
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Kullanıcı adı 3 ila 20 karakter arasında olmalı!")
      .max(20, "Kullanıcı adı 3 ila 20 karakter arasında olmalı!")
      .matches(
        /^[a-zA-Z0-9_.]+$/,
        "Kullanıcı adı sadece küçük, büyük harf, sayı, . ve _ içerebilir!!"
      )
      .matches(
        /^(?!.*[_.]{2}).*$/,
        "Kullanıcı adı yan yana . ve _ içeremez!"
      )
      .matches(
        /^[^_.].*[^_.]$/,
        "Kullanıcı adı . veya _ ile bitemez!"
      )
      .required("Kullanıcı adı sağlayınız!"),
    password: Yup.string()
      .min(8, "Şifre 8 karakterden kısa olamaz!")
      .max(32, "Şifre 32 karakterden uzun olamaz!")
      .matches(/[A-Z]/, "Şifre en az bir büyük harf içermelidir!")
      .matches(/[a-z]/, "Şifre en az bir küçük harf içermelidir!")
      .matches(/[0-9]/, "Şifre en az bir sayı içermelidir!")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Şifre en az bir özel karakter içermelidir!"
      )
      .matches(/^\S*$/, "Şifre boşluk içeremez!")
      .required("Şifre sağlayınız!"),
  });

  const onSubmit = (
    values: SignUpFormValues,
    { setSubmitting, resetForm }: any
  ) => {
    const userPayload = {
      username: values.username,
      password: values.password,
      isAdmin: false,
    };

    signupApi(userPayload)
      .then(() => {
        setMessage("Kayıt başarılı!");
        resetForm();
        setTimeout(() => {
          setMessage("");
          navigate("/login");
        }, 2000);
      })
      .catch((error) => {
        if (error.response.status === 409) {
          setMessage("Kullanıcı adı zaten kullanılıyor!");
        } else if (error.response.status === 400) {
          console.log(error);
          if (error.response.data.username)
            setMessage(
              "Kayıt sırasında hata: " + error.response.data.username
            );
          if (error.response.data.password)
            setMessage(
              "Kayıt sırasında hata: " + error.response.data.password
            );
        } else {
          console.log(error.response.data);
          setMessage("Kayıt sırasında hata.");
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="container">
      <br />
      <h2>Kaydol</h2>
      <br />
      {message && <div className="alert alert-info">{message}</div>}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <fieldset className="form-group" style={{ textAlign: "center" }}>
                <label htmlFor="username">Kullanıcı Adı</label>
                <Field
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  style={{ width: "300px", margin: "0 auto" }}
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="alert alert-warning"
                />
              </fieldset>

              <fieldset className="form-group" style={{ textAlign: "center" }}>
                <label htmlFor="password">Şifre</label>
                <Field
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  style={{ width: "300px", margin: "0 auto" }}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="alert alert-warning"
                />
              </fieldset>

              <div style={{ textAlign: "center" }}>
                <button
                  className="btn btn-primary mt-3"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Kaydol
                </button>
              </div>
              <br />
            </Form>
          )}
        </Formik>
      </div>
      <div>
        Zaten bir hesabınız var mı? <a href="/login">Giriş yap.</a>
      </div>
    </div>
  );
};

export default SignUp;
