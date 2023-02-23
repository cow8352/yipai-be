import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import UMayBeLike from "../../components/uMaybeLike/UMayBeLike";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaTruck, FaListAlt } from "react-icons/fa";
import { Table } from "react-bootstrap";
import "./cartPart2.css";
import ListItemsWithHook from "./pages/ShoppingCart/components/ListItemsWithHook";
import { useCart } from "./utils/useCart";
import BuyerLogin from "../users/login/Login";

const CartPart2 = () => {
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  const [users, setUsers] = useState([]);
  useEffect(() => {
    // 这里可以换成您的实际数据源
    async function getUsers() {
      let response = await axios.get(`http://localhost:3001`);
      setUsers(response.data);
      // console.log(response.data);
    }

    const data = [
      {
        id: users.users_id,
        phone: users.users_phone,
        city: users.send_address,
      },
    ];

    const shuffledUsers = shuffleArray(data).slice(0, 1);
    setUsers(shuffledUsers);
    getUsers();
  }, []);
  const {
    cart,
    items,
    addItem,
    removeItem,
    updateItem,
    clearCart,
    isInCart,
    plusOne,
    minusOne,
  } = useCart();
  // console.log(items)

  const navigate = useNavigate();
  const FirstCart = useCart();

  // const [postOrder, setPostOreder] = useState();

  const [product, setProduct] = useState([]);
  const [user_order, setUserOrder] = useState([]);
  const [login, setLogin] = useState(false);
  const [UserName, setUserName] = useState([]);
  const [address, setAddress] = useState("");
  const [memberItems, setMemberItems] = useState("");
  const [memberItemsPrice, setMemberItemsPrice] = useState("");
  const [handleSubmit, setHandleSubmit] = useState([]);
  
  

  useEffect(() => {
    function orderIdFor(item) {
      let j = '';
      for (let i = 0; i < item.length; i++) {
        j = item[i].id + ',' + j;
      }
      return j
    }
  
    function orderPriceFor(item) {
      let j = '';
      for (let i = 0; i < item.length; i++) {
        j = item[i].price + ',' + j;
      }
      return j
    }

    setMemberItems(orderIdFor(items));
    setMemberItemsPrice(orderPriceFor(items))
    
    
    // 在 component 初始化的時候跑一次
    // 通常會把去跟後端要資料的動作放在這裡
    async function getProduct() {
      let response = await axios.get("http://localhost:3001/cart");
      setProduct(response.data);
      // console.log(response.data);
    }
    getProduct();
    async function getUserOrder() {
      let response = await axios.get("http://localhost:3001/cart");
      setUserOrder(response.data);
      // console.log(response.data);
    }
    getUserOrder();
  }, []);

  useEffect(() => {
    async function getMember2() {
      let response = await axios.get(
        `http://localhost:3001/api/members/userData`,
        {
          withCredentials: true,
        }
      );

      if (Array.isArray(response.data) && response.data.length > 0) {
        setLogin(true);
      } else {
        setLogin(false);
      }
      // setOrderSubmit(response.data[0])
      setUserName(response.data[0]);
      // console.log(response.data[0]);
      setAddress(
        response.data[0].users_city +
          response.data[0].users_street +
          response.data[0].users_township
      );
    }
    getMember2();
  }, []);
//回傳到user_order資料庫的function
  async function postOrder(){
  //請求後端
    let response = await axios.post(`http://localhost:3001/api/members/orders`,{
      product_id:memberItems,
      users_id:UserName.users_id,
      amount:cart.totalItems,
      payment:"LinePay",
      send_address:address,
      total:cart.cartTotal,
      price:memberItemsPrice
        
    },{
      withCredentials:true
    });
  
    console.log(response.data);
    
    // 在請求完成後呼叫清空購物車的函式
    FirstCart.clearCart();
    setTimeout(() => {
      navigate('/cart/CartPart3');
    }, 100);
  }
  

  return (
    <div id="login">
      {login ? (
        <div className="font-family margin-50">
          <Link to="/products" className="keepbuying-button">
            ❮ 繼續購物
          </Link>
          <div className="flex-text margin-top-30">
            <h2>
              <FaTruck className="iconStyle-title" />
              寄貨地址
            </h2>
            <h5 className="">
              <span className="color-gray">1.我的購物車</span> ▶ 2.付款資訊
              <span className="color-gray"> ▶ 3.訂單成立</span>
            </h5>
          </div>
          <hr />

          <Table
            striped
            hover
            className="table-color margin-top-30 tables-text-size"
          >
            <thead>
              <tr>
                <th colSpan="" className="col text-center"></th>
                <th colSpan={1} className="col text-right">
                  收貨人
                </th>
                <th colSpan="" className="col text-center">
                  收貨地址確認
                </th>
                <th colSpan="" className="col text-center">
                  收貨人電話
                </th>
              </tr>
            </thead>
            <tbody className="line-height-50 text-right">
              {users.map((user) => (
                <tr>
                  <td colSpan={2} className="">
                    {UserName.users_name}
                  </td>
                  <td className="text-center">{address}</td>
                  <td className="text-center">{UserName.users_phone}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="flex-text margin-top-30">
            <h2>
              <FaListAlt className="iconStyle-title" />
              最後訂單確認
            </h2>
          </div>
          <div className="dis-re">
            <ListItemsWithHook />
            <UMayBeLike />

            <footer class="footer-floor1">
              <div>
                <a href="#news">結帳資訊 : </a>
              </div>
              <div>
                <a href="#contact">優惠券 : {0}</a>
                <a href="#contact">總數 : {cart.totalItems}</a>
                <a href="#contact">運費 : ${0}</a>
              </div>
            </footer>
            <footer class="footer-floor2">
              <a href="#total">購物車總計 : {cart.cartTotal}</a>
              <div>
                <Link to="../cart">
                  <button>上一頁</button>
                </Link>
                <Link to="/cart/CartPart3">
                  <button id="submitOrder" onClick={postOrder}>
                    前往結帳
                  </button>
                </Link>
              </div>
            </footer>
            <br />
            <br />
            <br />
          </div>
        </div>
      ) : (
        <BuyerLogin />
      )}
    </div>
  );
};
export default CartPart2;
