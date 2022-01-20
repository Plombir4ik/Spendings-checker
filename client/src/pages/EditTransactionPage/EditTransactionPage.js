import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import { Loader } from "../../components/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useHttp } from "../../hooks/http.hook";
import moment from "moment";
import { DatePicker } from "react-materialize";
import Materialize from "materialize-css";
import "./style.css";

export const EditTransactionPage = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const transactionId = useParams().id;
  const [title, SetTitle] = useState({
    mainTitle: "Створення транзакції",
    buttonTitle: "Додати",
  });
  const [categories, setCategories] = useState("");
  const [form, setForm] = useState({
    categoryId: "",
    categoryName: "",
    type: "",
    sum: Float32Array,
    description: "",
    dateInfo: Date(),
  });
  const { loading, request } = useHttp();
  const { token } = useContext(AuthContext);

  const dataChange = (event) => {
    if (event.target.name == "category") {
      var index = event.nativeEvent.target.selectedIndex;
      setForm({
        ...form,
        categoryId: event.target.value,
        categoryName: event.nativeEvent.target[index].text,
      });
    } else {
      setForm({ ...form, [event.target.name]: event.target.value });
    }
  };

  const loadCategories = useCallback(async () => {
    try {
      const fetched = await request("/api/categories", "GET", null, {
        Authorization: "Bearer" + " " + token,
      });
      setCategories(fetched);
    } catch (e) {}
  }, [token, request]);

  const loadTransaction = useCallback(async () => {
    try {
      const fetched = await request(
        "/api/transactions/" + transactionId,
        "GET",
        null,
        {
          Authorization: "Bearer" + " " + token,
        }
      );
      return fetched;
    } catch (e) {}
  }, [token, request, transactionId]);

  useLayoutEffect(() => {
    Materialize.AutoInit();
    var context = this;

    var elems = document.querySelectorAll(".dateset");
    Materialize.Datepicker.init(elems, {
      //defaultDate: new Date(),
      // format: "yyyy/mm/dd",
      container: "body",
      onSelect: function (date) {
        setForm({ ...form, dateInfo: date });
        console.log(moment(date).tz("Europe/Berlin").format()); // Selected date is logged
      },
      autoClose: true,
    });
  });

  useEffect(async () => {
    const info = loadCategories();

    if (transactionId !== undefined) {
      const info = await loadTransaction();
      SetTitle({
        mainTitle: "Редагування транзакції",
        buttonTitle: "Редагувати",
      });
      setForm(info);
    }
  }, [loadCategories]);

  const createPressed = async (event) => {
    try {
      if (transactionId !== undefined) {
        await request(
          "/api/transactions/" + transactionId,
          "PUT",
          { ...form },
          {
            Authorization: "Bearer" + " " + auth.token,
          }
        );
      } else {
        await request(
          "/api/transactions/create",
          "POST",
          { ...form },
          {
            Authorization: "Bearer" + " " + auth.token,
          }
        );
      }
      navigate("/transactions");
    } catch (e) {}
  };

  if (loading) {
    return <Loader />;
  }

  if (!categories.length) {
    return <p className="center">Транзакції відсутні</p>;
  }

  return (
    <div style={{ paddingTop: 15 }}>
      <h3
        className=" center-align"
        onClick={() => {
          console.log(form);
        }}
      >
        {title.mainTitle}
      </h3>
      <div
        className="grey lighten-5 "
        style={{
          border: "1px solid #000000",
          paddingBottom: 10,
          paddingTop: 15,
        }}
      >
        <div className="row">
          <h5 className="col s2 right-align " style={{ color: "black" }}>
            Назва категорії
          </h5>
          <div className="input-field col s3 offset-s0">
            <select name="category" value={form.category} onChange={dataChange}>
              <option value="" disabled selected>
                Тип категорії
              </option>
              {categories.map((category, index) => {
                return <option value={category._id}>{category.name}</option>;
              })}
            </select>
          </div>
        </div>

        <div className="row">
          <h5 className="col s2 right-align ">Тип операції</h5>
          <div className="input-field col s3 offset-s0">
            <select name="type" value={form.type} onChange={dataChange}>
              <option value="" disabled selected>
                Тип операції
              </option>
              <option value="Витрата">Витрата</option>
              <option value="Заробіток">Заробіток</option>
            </select>
          </div>
        </div>

        <div className="row">
          <h5 className="col s2 right-align" style={{ paddingLeft: 100 }}>
            Сума
          </h5>
          <input
            name="sum"
            className="col s1 "
            value={form.sum}
            name="sum"
            onChange={dataChange}
          ></input>
        </div>

        <div className="row">
          <h5 className="col s2 ">Короткий опис</h5>
          <input
            name="desciption"
            value={form.description}
            className="col s4 "
            name="description"
            onChange={dataChange}
          ></input>
        </div>

        <div className="row">
          <h5 className="col s2 ">Дата транзакції</h5>
          <input
            id="date"
            type="text"
            className="datepicker dateset col s1 no-autoinit "
            value={moment(form.dateInfo).format("DD.MM.YYYY")}
          />
        </div>

        <div className="row">
          <a
            className="col 1  waves-effect indigo btn "
            onClick={createPressed}
            style={{ marginTop: 25, marginLeft: 25 }}
          >
            {title.buttonTitle}
          </a>
          <a
            className="col s1 waves-effect indigo btn "
            style={{ marginTop: 25, marginLeft: 25 }}
            onClick={() => {
              setForm({
                categoryId: "",
                categoryName: "",
                type: "",
                sum: Float32Array,
                description: "",
                dateInfo: Date.now(),
              });
            }}
          >
            Очистити
          </a>
        </div>
      </div>
    </div>
  );
};
