import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";

/*Membuat sebuah context bernama AuthContext, 
yang bisa digunakan untuk menyimpan dan 
mengakses data tentang status autentikasi user.*/
const AuthContext = createContext();

/**Membuat sebuah component bernama AuthContextProvider, 
 yang bertugas untuk menyediakan data autentikasi user kepada 
 component-component lain yang menjadi children-nya. */
export const AuthContextProvider = ({ children }) => {

  /**Menggunakan state bernama user dan setUser untuk 
   menyimpan data user yang sedang 
   login atau null jika tidak ada user yang login */
  const [user, setUser] = useState(null);

  /**Menggunakan GoogleAuthProvider dan
   signInWithPopup dari firebase auth untuk membuat 
   fungsi googleSignIn yang bisa 
   digunakan untuk login dengan akun Google. */
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  /**Menggunakan signOut dari firebase auth untuk
   *  membuat fungsi logOut yang
   *  bisa digunakan untuk logout dari akun Google. */
  const logOut = () => {
    signOut(auth);
  };

  /**Menggunakan useEffect untuk menjalankan
   *  fungsi onAuthStateChanged dari firebase auth,
   *  yang akan memanggil callback setiap kali ada
   *  perubahan status user (login atau logout).
   *  Callback tersebut akan mengubah state user
   *  sesuai dengan currentUser yang diberikan oleh
   *  firebase auth. useEffect juga akan mengembalikan 
   * fungsi unsubscribe yang akan membatalkan listener
   *  onAuthStateChanged ketika component unmount. */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [user]);

  /**Mengembalikan sebuah AuthContext.Provider
   *  yang memiliki value berupa objek yang berisi user,
   *  googleSignIn, dan logOut. AuthContext.Provider juga 
   * memiliki children sebagai properti, yang merupakan
   *  component-component 
   * lain yang ingin menggunakan data autentikasi user. */
  return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

/**Membuat sebuah custom hook bernama UserAuth, yang 
 * menggunakan useContext untuk mengambil value dari AuthContext. 
 * Custom hook ini bisa digunakan oleh component lain untuk mendapatkan data user,
 *  googleSignIn, dan logOut dengan mudah. */

export const UserAuth = () => {
  return useContext(AuthContext);
};
