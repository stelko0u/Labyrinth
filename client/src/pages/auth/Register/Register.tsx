import { Link, useNavigate } from "react-router-dom";
import bg2 from "../../../assets/bg2.png";
import bgForm from "../../../assets/signImage.jpg";
import logo from "../../../assets/logo.png";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { ClipLoader } from "react-spinners";
import { Axios } from "../../../helpers/http";
import { capitalize } from "../../../helpers/capitalize";

export default function Login() {
  const { register } = useAuth();
  const [emailAddress, setEmailAddress] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [roleId, setRoleId] = useState(-1);

  const [emailIsValid, setEmailIsValid] = useState<null | boolean>(null);
  const [usernameIsValid, setUsernameIsValid] = useState<null | boolean>(null);
  const [passwordIsValid, setPasswordIsValid] = useState<null | boolean>(null);
  const [rePasswordIsValid, setRePasswordIsValid] = useState<null | boolean>(null);
  const [phoneNumberIsValid, setPhoneNumberIsValid] = useState<null | boolean>(null);
  const [roleIsValid, setRoleIsValid] = useState<null | boolean>(null);

  const [serverMsg, setServerMsg] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [roleOptions, setRoleOptions] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await Axios.get("/roles");
        setRoleOptions(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  let emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  // let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.{8,}).*$/;
  let phoneNumberRegex = /^(((\+|00)359[- ]?)|(0))(8[- ]?[789]([- ]?\d){7})$/gm;
  let inputFields = `px-2 py-1 text-md w-full`;
  const onChangeInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmailAddress(value);
      setEmailIsValid(value ? emailRegex.test(value) : null);
    } else if (name === "username") {
      setUsername(value);
      setUsernameIsValid(value ? value.length > 4 : null);
    } else if (name === "password") {
      setPassword(value);
      // setPasswordIsValid(value ? passwordRegex.test(value) : null);
      setPasswordIsValid(value.length >= 8 ? true : false);
      setRePasswordIsValid(rePassword ? value === rePassword : null);
    } else if (name === "rePassword") {
      setRePassword(value);
      setRePasswordIsValid(value ? value === password : null);
    } else if (name === "phoneNumber") {
      setPhoneNumber(value);
      setPhoneNumberIsValid(value ? phoneNumberRegex.test(value) : null);
    }
  };
  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setRoleId(parseInt(value));
    setRoleIsValid(parseInt(value) > 0 ? true : false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setServerMsg([]);
    e.preventDefault();

    let msg: string[] = [];

    if (
      !(
        emailIsValid &&
        passwordIsValid &&
        usernameIsValid &&
        rePasswordIsValid &&
        phoneNumberIsValid &&
        roleIsValid
      )
    ) {
      msg.push("Please enter valid data!");
      setServerMsg(msg);
      return;
    }

    setLoading(true);

    try {
      await register(emailAddress, username, password, phoneNumber, rePassword, roleId);
      setLoading(false);
      navigate("/");
    } catch (error: any) {
      setLoading(false);

      let errorMessages: string[] = [];

      if (typeof error === "object") {
        for (const key in error) {
          if (error.hasOwnProperty(key)) {
            errorMessages.push(`${error[key]}`);
          }
        }
      } else {
        errorMessages.push("An error occurred during registration.");
      }
      setServerMsg(errorMessages);
    }
  };

  return (
    <div className="relative w-full overflow-hidden h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bg2})` }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm"></div>

      <div className="absolute inset-0 flex items-center justify-center w-full">
        {/* <div className='bg-slate-700 w-full absolute top-0'>
                    <Link
                        to='/'
                        className='absolute z-20 top-0 left-0 m-1 bg-slate-100 px-3 py-1 rounded-full hover:bg-slate-600 hover:text-white duration-200'
                    >
                        Back to home
                    </Link>
                    <Link
                        to='/login'
                        className='lg:hidden absolute z-20 top-0 right-0 m-1 bg-slate-100 px-3 py-1 rounded-full hover:bg-slate-600 hover:text-white duration-200'
                    >
                        Go to sign in
                    </Link>
                </div> */}
        <div className="lg:w-3/5 w  backdrop-blur-md bg-[#E0E0E0]  bg-opacity-60 rounded-lg flex justify-center text-center flex-row ">
          <div className="lg:w-1/2  bg-white  flex-col items-center rounded-l-lg hidden lg:flex">
            <h1 className="text-2xl font-semibold uppercase tracking-wide pt-10 pb-2">Welcome</h1>
            <img src={logo} alt="logo" className="w-36 h-36 " />
            <p className="pb-9 text-lg">Already have an account? </p>
            <Link
              to="/login"
              className="text-lg  font-semibold text-black border-black  border-2
            px-2 rounded-full hover:text-white hover:bg-black transition-all duration-300"
            >
              Sign in
            </Link>
          </div>
          <div
            className="lg:w-1/2 w-full relative inset-0 bg-cover bg-center p-4 rounded-lg lg:rounded-r-lg"
            style={{ backgroundImage: `url(${bgForm})` }}
          >
            <h2 className="text-3xl text-center pt-1 pb-1 text-gray-200 font-semibold -tracking-tighter ">
              Register
            </h2>
            <form
              onSubmit={handleSubmit}
              className="flex justify-center flex-col items-center gap-2 pt-3"
            >
              <input
                type="text"
                name="username"
                value={username}
                onChange={onChangeInputs}
                id="username"
                placeholder="Username"
                className={`${inputFields} ${
                  usernameIsValid === false ? "shadow-red-500 shadow-xl" : ""
                } ${usernameIsValid === null || usernameIsValid === true ? "" : ""}`}
              />

              <input
                type="text"
                name="phoneNumber"
                value={phoneNumber}
                onChange={onChangeInputs}
                id="phoneNumber"
                placeholder="Phone number"
                className={`${inputFields}  ${
                  phoneNumberIsValid === false ? "shadow-red-500 shadow-xl " : ""
                } ${phoneNumberIsValid === null || phoneNumberIsValid === true ? "" : ""}`}
              />

              <input
                type="text"
                name="email"
                value={emailAddress}
                onChange={onChangeInputs}
                id="email"
                placeholder="Email"
                className={`${inputFields}  ${
                  emailIsValid === false ? "shadow-red-500 shadow-xl" : ""
                } ${emailIsValid === null || emailIsValid === true ? "" : ""}`}
              />

              <input
                type="password"
                name="password"
                value={password}
                onChange={onChangeInputs}
                id="password"
                placeholder="Password"
                className={`${inputFields}  ${
                  passwordIsValid === false ? "shadow-red-500 shadow-xl" : ""
                } ${passwordIsValid === null || passwordIsValid === true ? "" : ""}`}
              />

              <input
                type="password"
                name="rePassword"
                value={rePassword}
                onChange={onChangeInputs}
                id="rePassword"
                placeholder="Confirm password"
                className={`${inputFields}  ${
                  rePasswordIsValid === false ? "shadow-red-500 shadow-xl" : ""
                } ${rePasswordIsValid === null || rePasswordIsValid === true ? "" : ""}`}
              />

              <select
                name="role"
                id=""
                className={`${inputFields}  ${
                  roleIsValid === false ? " shadow-red-500 shadow-xl" : ""
                } ${roleIsValid === null || roleIsValid === true ? "" : ""}`}
                onChange={onSelectChange}
              >
                <option value="-99" selected>
                  Choose a role
                </option>

                {roleOptions.map(({ id, name }) => (
                  <option value={id}>{capitalize(name)}</option>
                ))}
              </select>
              <span className="lg:w-auto w-full">
                <input
                  type="submit"
                  value="Register"
                  className="text-white text-lg px-4 w-full lg:w-auto p-2 border-white border-2 rounded-full  hover:bg-white hover:text-black transition-all duration-300"
                />
                {serverMsg.length > 0 && (
                  <div className="text-red-400 text-sm">
                    {serverMsg.map((msg, index) => (
                      <p key={index}>{msg}</p>
                    ))}
                  </div>
                )}
              </span>
            </form>
          </div>
        </div>
      </div>
      {loading && (
        <div className="sweet-loading h-screen fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
          <ClipLoader size={150} color={"#ffff"} className="w-3" loading={loading} />
        </div>
      )}
    </div>
  );
}
