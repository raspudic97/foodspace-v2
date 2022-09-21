import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import "./whyuscard.css";

function WhyUsCard(props) {
  return (
    <div className="card">
      {props.icon}
      <h1 className="card-title">{props.title}</h1>
      <p className="card-pharagraph">{props.body}</p>
    </div>
  );
}

export default WhyUsCard;
