import React, { useContext, useState, useEffect, useCallback } from "react";
import { Loader } from "../../components/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useHttp } from "../../hooks/http.hook";
import "./style.css";

export const EditCategoryPage = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const categoryId = useParams().id;
  const [title, SetTitle] = useState({
    mainTitle: "Створення категорії",
    buttonTitle: "Додати",
  });
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const { loading, request } = useHttp();
  const { token } = useContext(AuthContext);

  const dataChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const loadCategory = useCallback(async () => {
    try {
      const fetched = await request(
        "/api/categories/" + categoryId,
        "GET",
        null,
        {
          Authorization: "Bearer" + " " + token,
        }
      );
      return fetched;
    } catch (e) {}
  }, [token, request, categoryId]);

  useEffect(async () => {
    const info = await loadCategory();
    if (categoryId !== undefined) {
      SetTitle({
        mainTitle: "Редагування категорії",
        buttonTitle: "Редагувати",
      });
      setForm(info);
    }
  }, [loadCategory]);

  const createPressed = async (event) => {
    try {
      if (categoryId !== undefined) {
        await request(
          "/api/categories/" + categoryId,
          "PUT",
          { ...form },
          {
            Authorization: "Bearer" + " " + auth.token,
          }
        );
      } else {
        await request(
          "/api/categories/create",
          "POST",
          { ...form },
          {
            Authorization: "Bearer" + " " + auth.token,
          }
        );
      }
      navigate("/categories");
    } catch (e) {}
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ paddingTop: 15 }}>
      <h3 className=" center-align">{title.mainTitle}</h3>
      <div
        className="grey lighten-5 "
        style={{
          border: "1px solid #000000",
          paddingBottom: 10,
          paddingTop: 15,
        }}
      >
        <div className="row ">
          <h5 className="col s2">Назва категорії</h5>
          <input
            className="col s3"
            name="name"
            value={form.name}
            onChange={dataChange}
          ></input>
        </div>
        <div className="row">
          <h5 className="col s2">Опис категорії</h5>
          <input
            className="col s6"
            name="description"
            value={form.description}
            onChange={dataChange}
          ></input>
        </div>
        <div className="row">
          <a
            class="col 1  waves-effect indigo btn "
            style={{ marginTop: 25, marginLeft: 25 }}
            onClick={createPressed}
          >
            {title.buttonTitle}{" "}
          </a>
          <a
            class="col s1 waves-effect indigo btn "
            style={{ marginTop: 25, marginLeft: 25 }}
            onClick={() => {
              setForm({ name: "", description: "" });
            }}
          >
            Очистити
          </a>
        </div>
      </div>
    </div>
  );
};
