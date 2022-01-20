import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import Materialize from "materialize-css";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import "./style.css";

export const ReportsPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: "Витрата",
    dateFrom: Date(),
    dateTo: Date(),
  });

  const dataChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  useLayoutEffect(() => {
    Materialize.AutoInit();
    var context = this;

    var elems = document.querySelectorAll(".dateset");
    Materialize.Datepicker.init(elems, {
      defaultDate: new Date(),
      // format: "yyyy/mm/dd",
      container: "body",
      onSelect: function (date) {
        setForm({ ...form, dateFrom: date });
        console.log(date); // Selected date is logged
      },
      autoClose: true,
    });

    var elems = document.querySelectorAll(".dateset2");
    Materialize.Datepicker.init(elems, {
      defaultDate: new Date(),
      // format: "yyyy/mm/dd",
      container: "body",
      onSelect: function (date) {
        setForm({ ...form, dateTo: date });
        console.log(date); // Selected date is logged
      },
      autoClose: true,
    });
  });

  return (
    <div>
      <div style={{ paddingTop: 15 }}>
        <h3 className=" center-align">Генератор звітів</h3>
        <div
          className="grey lighten-5 "
          style={{
            border: "1px solid #000000",
            paddingBottom: 10,
            paddingTop: 15,
          }}
        >
          <div className="row">
            <h5 className="col s2 right-align ">Початкова дата</h5>
            <input
              id="date"
              type="text"
              className="datepicker dateset col s2 no-autoinit "
              style={{ marginLeft: 15 }}
              value={moment(form.dateFrom).format("DD.MM.YYYY")}
            />
          </div>

          <div className="row">
            <h5 className="col s2 right-align ">Кінцева дата</h5>
            <input
              id="date"
              type="text"
              className="datepicker dateset2 col s2 no-autoinit "
              style={{ marginLeft: 15 }}
              value={moment(form.dateTo).format("DD.MM.YYYY")}
            />
          </div>

          <div className="row">
            <h5 className="col s2 right-align ">Тип операції</h5>
            <div className="input-field col s3 offset-s0">
              <select name="type" value={form.type} onChange={dataChange}>
                <option selected value="Витрата">
                  Витрата
                </option>
                <option value="Заробіток">Заробіток</option>
              </select>
            </div>
          </div>

          <div className="row">
            <a
              className="col s2 waves-effect indigo btn "
              style={{ marginTop: 25, marginLeft: 25 }}
              onClick={() => {
                navigate(
                  "/reports/pie/" +
                    form.dateFrom +
                    "_" +
                    form.type +
                    "_" +
                    form.dateTo
                );
              }}
            >
              Графік
            </a>
            <a
              className="col s2 waves-effect indigo btn "
              style={{ marginTop: 25, marginLeft: 25 }}
              onClick={() => {
                navigate(
                  "/reports/line/" +
                    form.dateFrom +
                    "_" +
                    form.type +
                    "_" +
                    form.dateTo
                );
              }}
            >
              По датам
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
