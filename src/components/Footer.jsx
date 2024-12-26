import { FaHeart } from "react-icons/fa";

const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <footer className="flex flex-col justify-center text-gray-300">
      <ul className="uppercase flex gap-3 text-lg justify-center font-semibold tracking-wider">
        <li className="hover:text-gray-100"><a href="#">home</a></li>
        <li className="hover:text-gray-100"><a href="#">terms</a></li>
        <li className="hover:text-gray-100"><a href="#">privacy</a></li>
        <li className="hover:text-gray-100"><a href="#">contact</a></li>
      </ul>
      <p className="flex items-center justify-center gap-1 text-center my-2 text-lg">Made w/ <FaHeart className="mt-1" /> by md_mark</p>
      <p className="text-center mb-5">&copy; YTLoops {year}. All Rights Reserved.</p>
    </footer>
  )
}

export default Footer;