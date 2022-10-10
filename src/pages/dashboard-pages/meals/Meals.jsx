import "./meals.css";
import DashboardSidebar from "./../../../components/dashboard-sidebar/DashboardSidebar";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import { db, storage } from "../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  query,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#333",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(id, image, name, category, ingredients, price) {
  return { id, image, name, category, ingredients, price };
}

const style = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #ff0000",
  boxShadow: 24,
  p: 4,
};

let photoURL = "";

function Meals() {
  const mealNameRef = useRef(null);
  const mealIngredientsRef = useRef(null);
  const mealPriceRef = useRef(null);
  const mealPictureRef = useRef(null);
  const mealCategoryRef = useRef(null);
  const mealSalePercentageRef = useRef(0);
  const [photo, setPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = (id) => setOpen(id);
  const handleClose = () => setOpen(false);

  async function getMeals() {
    const q = query(collection(db, "meals"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const res = { ...doc.data() };
      setRows((prev) => [
        ...prev,
        createData(
          doc.id,
          res.photo_url,
          res.name,
          res.category,
          res.ingredients,
          res.price
        ),
      ]);
    });
  }

  function deleteMeal(id) {
    const docRef = doc(db, "meals", `${id}`);

    deleteDoc(docRef)
      .then(() => {
        console.log("Entire Document has been deleted successfully.");
      })
      .catch((error) => {
        console.log(error);
      });

    const newRows = rows.filter((row) => row.id !== id);
    setRows(newRows);
  }

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  async function handleUpdatePhoto(file, fileName) {
    const fileRef = ref(storage, `meals-pictures/${fileName}`);
    await uploadBytes(fileRef, file);

    await getDownloadURL(fileRef).then((url) => {
      photoURL = url;
    });
  }

  async function updateMeal(id, meal_price) {
    const mealRef = doc(db, "meals", `${id}`);

    const mealName = mealNameRef.current.value;
    const mealCategory = mealCategoryRef.current.value;
    const mealIngredients = mealIngredientsRef.current.value;
    const mealPrice = mealPriceRef.current.value;
    const mealSalePercentage = mealSalePercentageRef.current.value;

    const newMealData = {
      ...(mealName && { name: mealName }),
      ...(mealCategory && { category: mealCategory }),
      ...(mealIngredients && { ingredients: mealIngredients }),
      ...(mealPrice && { price: mealPrice }),
      ...(photo && { photo_url: photoURL }),
      ...(mealSalePercentage &&
        mealSalePercentage !== 0 && {
          sale_percentage: mealSalePercentage,
        }),
      ...(mealSalePercentage && {
        sale: mealSalePercentage == 0 ? false : true,
      }),
      ...(mealSalePercentage &&
        mealSalePercentage !== 0 && {
          sale_price: parseFloat(
            parseFloat(meal_price) -
              (parseFloat(mealSalePercentage) / 100) * parseFloat(meal_price)
          ).toFixed(2),
        }),
    };

    await updateDoc(mealRef, newMealData);
  }

  async function handleUpdate(id, meal_price) {
    setIsUploading(true);
    if (mealPictureRef.current.value) {
      await handleUpdatePhoto(photo, photo.name);
    }

    await updateMeal(id, meal_price);
    resetForm();
    setIsUploading(false);
  }

  function resetForm() {
    mealCategoryRef.current.value = "";
    mealNameRef.current.value = "";
    mealIngredientsRef.current.value = "";
    mealPictureRef.current.value = "";
    mealPriceRef.current.value = 0;
    mealSalePercentageRef.current.value = 0;
    setOpen(false);
  }

  useEffect(() => {
    getMeals();
  }, []);

  return (
    <div className="dashboard-container">
      <DashboardSidebar active="meals" />
      <div className="dashboard-content">
        <div className="add-new-meal">
          <Link to={"/dashboard/meals/new"} replace>
            Add new meal
          </Link>
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Image</StyledTableCell>
                <StyledTableCell align="left">Name</StyledTableCell>
                <StyledTableCell align="left">Category</StyledTableCell>
                <StyledTableCell align="left">Ingredients</StyledTableCell>
                <StyledTableCell align="left">Price</StyledTableCell>
                <StyledTableCell align="left">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    <img
                      className="meal-table-img"
                      src={row.image}
                      alt="meal"
                    />
                  </StyledTableCell>
                  <StyledTableCell align="left">{row.name}</StyledTableCell>
                  <StyledTableCell align="left">{row.category}</StyledTableCell>
                  <StyledTableCell align="left">
                    {row.ingredients}
                  </StyledTableCell>
                  <StyledTableCell align="left">{row.price} $</StyledTableCell>
                  <StyledTableCell align="left">
                    <button
                      onClick={() => {
                        deleteMeal(row.id);
                      }}
                      className="delete-meal-btn"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleOpen(row.id)}
                      className="edit-meal-btn"
                    >
                      Edit
                    </button>

                    <Modal
                      open={open === row.id}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={style} className="modal">
                        <input
                          ref={mealNameRef}
                          type="text"
                          placeholder="Name"
                        />
                        <input
                          ref={mealCategoryRef}
                          type="text"
                          placeholder="Category"
                        />
                        <input
                          ref={mealIngredientsRef}
                          type="text"
                          placeholder="Ingredients"
                        />
                        <input
                          ref={mealPriceRef}
                          type="number"
                          placeholder="Price"
                        />
                        <input
                          ref={mealPictureRef}
                          onChange={handleChange}
                          type="file"
                          placeholder="Select meal photo"
                        />
                        <input
                          ref={mealSalePercentageRef}
                          type="number"
                          placeholder="Sale percentage (0 for no sale)"
                        />
                        <button
                          disabled={isUploading}
                          onClick={() => {
                            handleUpdate(row.id, row.price);
                          }}
                        >
                          Update meal
                        </button>
                      </Box>
                    </Modal>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default Meals;
