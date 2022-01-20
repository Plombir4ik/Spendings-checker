import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { AuthContext } from "../../context/AuthContext";
import { useHttp } from "../../hooks/http.hook";
import { Loader } from "../../components/Loader";
import HighLightOff from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/EditOutlined";
import IconButton from "@material-ui/core/Button";
import "./style.css";

export const TransactionsPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState("");
  const [transactions, setTransactions] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({
    id: "",
    name: "",
  });
  const [selectedName, setSelectedName] = useState("");
  const { loading, request } = useHttp();
  const { token } = useContext(AuthContext);

  const dataChange = (event) => {
    var index = event.nativeEvent.target.selectedIndex;
    console.log(event);
    setSelectedCategory({
      id: event.target.value,
      name: event.nativeEvent.target[index].text,
    });
  };

  const loadData = useCallback(async () => {
    try {
      const fetched = await request("api/transactions", "GET", null, {
        Authorization: "Bearer" + " " + token,
      });
      const { categories, transactions } = fetched;
      console.log(categories);
      setCategories(categories);
      setTransactions(transactions);
    } catch (e) {}
  }, [token, request]);

  const deleteTransaction = useCallback(
    async (transactionId) => {
      try {
        const data = await request(
          "api/transactions",
          "DELETE",
          { transactionId: transactionId },
          {
            Authorization: "Bearer" + " " + token,
          }
        );
      } catch (e) {}
      loadData();
    },
    [token, request]
  );

  useLayoutEffect(() => {
    window.M.AutoInit();
  });

  useEffect(() => {
    loadData();
  }, [loadData]);

  function fil(value) {
    if (selectedCategory.id == "") {
      return true;
    } else {
      if (value.categoryId === selectedCategory.id) {
        return true;
      } else {
        return false;
      }
    }
  }

  const topBottomMargin = {
    marginTop: 15,
    marginBottom: 15,
  };

  if (loading) {
    return <Loader />;
  }

  if (!transactions.length) {
    return (
      <div className="row">
        <p className="center">Транзакції відсутні</p>
        <a
          class="col s2 offset-s5 waves-effect indigo btn center-align"
          onClick={() => {
            navigate("/transactions/create");
          }}
        >
          Додати Транзакцію
        </a>
      </div>
    );
  }

  return (
    <div>
      <h3 className=" center-align">Транзакції </h3>
      <div style={{ paddingTop: 10, marginTop: 15 }}>
        <div className="row">
          <div class="input-field col s3 offset-s1">
            <select onChange={dataChange} style={{ color: "black" }}>
              <option value="" selected>
                Виберіть категорію
              </option>
              {categories.map((category, index) => {
                return <option value={category._id}>{category.name}</option>;
              })}
            </select>
          </div>
        </div>

        <div className="row">
          <table className="col s12 centered striped highlight">
            <thead>
              <tr>
                <th className="col s1">№</th>
                <th className="col s2">Категорія</th>
                <th className="col s2">Тип операції</th>
                <th className="col s1">Сума</th>
                <th className="col s1">Дата</th>
                <th className="col s3">Опис</th>
                <th className="col s2 ">Управління</th>
              </tr>
            </thead>

            <tbody>
              {transactions.filter(fil).map((transaction, index) => {
                return (
                  <tr key={transaction._id} style={{ marginTop: 15 }}>
                    <td className="col s1" style={topBottomMargin}>
                      {index + 1}
                    </td>
                    <td className="col s2" style={topBottomMargin}>
                      {transaction.categoryName}
                    </td>
                    <td className="col s2" style={topBottomMargin}>
                      {transaction.type}
                    </td>
                    <td className="col s1" style={topBottomMargin}>
                      {Number(transaction.sum).toFixed(2)} ₴
                    </td>
                    <td className="col s1" style={topBottomMargin}>
                      {moment(transaction.date).format("DD.MM.YYYY")}
                    </td>
                    <td className="col s3" style={topBottomMargin}>
                      {transaction.description}
                    </td>
                    <td className="col s2">
                      <IconButton>
                        <Edit
                          fontSize="large"
                          onClick={() => {
                            navigate("/transactions/" + transaction._id);
                          }}
                        />
                      </IconButton>
                      <IconButton>
                        <HighLightOff
                          fontSize="large"
                          onClick={() => {
                            deleteTransaction(transaction._id);
                          }}
                        />
                      </IconButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <a
          class="waves-effect indigo btn"
          style={{ marginTop: "2rem", marginBottom: "2rem", marginLeft: 25 }}
          onClick={() => {
            navigate("/transactions/create");
          }}
        >
          Додати Транзакцію
        </a>
      </div>
    </div>
  );
};
