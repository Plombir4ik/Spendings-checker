import React, { useContext, useState, useEffect } from "react";
import { useHttp } from "../../hooks/http.hook";
import { useMessage } from "../../hooks/message.hook";
import { AuthContext } from "../../context/AuthContext";
import "./style.css";

export const AuthPage = () => {
  const auth = useContext(AuthContext);
  const message = useMessage();

  const { loading, request, error, clearError } = useHttp();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  const dataChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const register = async () => {
    try {
      const data = await request("/api/auth/register", "POST", { ...form });
      message(data.message);
    } catch (e) {}
  };

  const login = async () => {
    try {
      const data = await request("/api/auth/login", "POST", { ...form });
      auth.login(data.token, data.userId);
    } catch (e) {}
  };

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <div className="card indigo darken-1 z-depth-5">
          <div className="card-content white-text">
            <span className="card-title">Авторизація</span>
            <div>
              <div className="input-field ">
                <input
                  style={{ color: "white" }}
                  id="email"
                  type="email"
                  name="email"
                  onChange={dataChange}
                />
                <label htmlFor="email">Email</label>
              </div>
              <div className="input-field">
                <input
                  style={{ color: "white" }}
                  id="password"
                  type="password"
                  name="password"
                  onChange={dataChange}
                />
                <label htmlFor="password">Password</label>
              </div>
            </div>
          </div>
          <div className="card-action">
            <a
              className="waves-effect yellow darken-3 btn"
              style={{ marginRight: 15 }}
              onClick={login}
              disabled={loading}
            >
              Вхід{" "}
            </a>
            <a
              className="waves-effect grey btn"
              onClick={register}
              disabled={loading}
            >
              {" "}
              Реєстрація{" "}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
