import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import "./whyuscard.css";

const whyUsCards = [
  {
    icon: (
      <ShoppingCartIcon
        className="card-icon"
        style={{
          color: "rgba(255,0,0,0.75)",
          backgroundColor: "rgba(255,0,0,0.25)",
        }}
      />
    ),
    title: "Easy to order",
    body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
  },
  {
    icon: (
      <DeliveryDiningIcon
        className="card-icon"
        style={{
          color: "rgba(0,0,255,0.75)",
          backgroundColor: "rgba(0,0,255,0.25)",
        }}
      />
    ),
    title: "Fast delivery",
    body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
  },
  {
    icon: (
      <CreditScoreIcon
        className="card-icon"
        style={{
          color: "rgba(148,0,211,0.75)",
          backgroundColor: "rgba(148,0,211,0.25)",
        }}
      />
    ),
    title: "Secure payment",
    body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
  },
];

function WhyUsCard() {
  return (
    <div className="why-us-bottom">
      {whyUsCards.map((card) => (
        <div key={card.title} className="card">
          {card.icon}
          <h1 className="card-title">{card.title}</h1>
          <p className="card-pharagraph">{card.body}</p>
        </div>
      ))}
    </div>
  );
}

export default WhyUsCard;
