import React, { useState, useContext, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useHttp } from "../../hooks/http.hook";
import { Loader } from "../../components/Loader";
import Edit from "@material-ui/icons/EditOutlined";
import HighLightOff from "@material-ui/icons/DeleteOutline";
import IconButton from "@material-ui/core/Button";
import "./style.css";

export const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState("");
  const { loading, request } = useHttp();
  const { token } = useContext(AuthContext);

  const loadCategories = useCallback(async () => {
    try {
      const fetched = await request("api/categories", "GET", null, {
        Authorization: "Bearer" + " " + token,
      });
      setCategories(fetched);
    } catch (e) {}
  }, [token, request]);

  const deleteCategory = useCallback(
    async (categoryId) => {
      try {
        const data = await request(
          "api/categories",
          "DELETE",
          { categoryId: categoryId },
          {
            Authorization: "Bearer" + " " + token,
          }
        );
      } catch (e) {}
      loadCategories();
    },
    [token, request]
  );

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  if (loading) {
    return <Loader />;
  }

  if (!categories.length) {
    return (
      <div className="row">
        <p className="center">Категорії відсутні</p>
        <a
          class="col s2 offset-s5 waves-effect indigo btn center-align"
          onClick={() => {
            navigate("/categories/create");
          }}
        >
          Додати Категорію
        </a>
      </div>
    );
  }

  return (
    <div>
      <h3 className=" center-align">Категорії </h3>
      <div style={{ paddingTop: 10, marginTop: 15 }}>
        <table className="centered striped highlight">
          <thead>
            <tr>
              <th>№</th>
              <th>Назва</th>
              <th>Опис</th>
              <th>Редагувати</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category, index) => {
              return (
                <tr key={category._id}>
                  <td>{index + 1}</td>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td>
                    <IconButton>
                      <Edit
                        fontSize="large"
                        onClick={() => {
                          navigate("/categories/" + category._id);
                        }}
                      />
                    </IconButton>
                    <IconButton>
                      <HighLightOff
                        fontSize="large"
                        onClick={() => {
                          deleteCategory(category._id, index);
                        }}
                      />
                    </IconButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <a
          class="waves-effect indigo btn"
          style={{ marginTop: "2rem", marginBottom: "2rem", marginLeft: 25 }}
          onClick={() => {
            navigate("/categories/create");
          }}
        >
          Додати Категорію
        </a>
      </div>
    </div>
  );
};
