import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { AuthContext } from "../../context/AuthContext";
import { useHttp } from "../../hooks/http.hook";
import { Loader } from "../../components/Loader";
import moment from "moment";

export const ReportsPiePage = () => {
  ChartJS.register(ArcElement, Tooltip, Legend);

  const urlId = useParams().id;
  const [categories, setCategories] = useState([]);
  const { loading, request } = useHttp();
  const { token } = useContext(AuthContext);

  const loadCategories = useCallback(async () => {
    try {
      const fetched = await request("/api/reports/pie/" + urlId, "GET", null, {
        Authorization: "Bearer" + " " + token,
      });
      setCategories(fetched);
    } catch (e) {}
  }, [token, request]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const data = {
    labels: categories.map((category) => category.name),
    datasets: [
      {
        label: "# of Votes",
        data: categories.map((category) => category.sum),
        backgroundColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255,1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return <Loader />;
  }

  if (!categories.length) {
    return <p className="center">Транзакції відсутні</p>;
  }

  return (
    <div>
      <div className="row">
        <h3
          className="center-align"
          onClick={() => {
            console.log("fromId");
          }}
        >
          Звіти по категоріям за період:{" "}
          {moment(urlId.split("_")[0]).format("DD.MM.YYYY") +
            "-" +
            moment(urlId.split("_")[2]).format("DD.MM.YYYY")}{" "}
        </h3>
      </div>
      <div className="row">
        <Pie
          className="col s2"
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          }}
          data={data}
          style={{ height: 800, width: 800 }}
        />
      </div>
    </div>
  );
};
