import { toast } from "react-toastify";
import { addItemToCartApi } from "../components/api/CartApiService";
import { addItemToWishlistApi } from "../components/api/WishlistApiService";

export const handleAddToCart = (
  id: number,
  setShowModal: (value: boolean) => void,
  setModalMessage: (message: string) => void
) => {
  addItemToCartApi(id)
    .then(() => {
      toast.success("Ürün sepete eklendi!");
    })
    .catch((error) => {
      if (error.response?.status === 401) {
        setModalMessage("Sepetinize ürün eklemek için üye olmanız gerekmektedir.");
        setShowModal(true);
      } else {
        toast.error("Ürün sepetinize eklenemedi.");
      }
    });
};

export const handleAddToWishlist = (
  id: number,
  setShowModal: (value: boolean) => void,
  setModalMessage: (message: string) => void
) => {
  addItemToWishlistApi(id)
    .then(() => {
      toast.success("Ürün favorilere eklendi!");
    })
    .catch((error) => {
      if (error.response?.status === 401) {
        setModalMessage("Favorilerinize ürün eklemek için üye olmanız gerekmektedir.");
        setShowModal(true);
      } else {
        toast.error("Ürün favorilerinizde zaten mevcut.");
      }
    });
};