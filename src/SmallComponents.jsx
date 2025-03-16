// export const InputFields = ({ id, label, placeholder, type, required, name, value, onChange, options }) => {
//   return (
//     <div className="flex flex-col">
//       <label htmlFor={id} className="font-semibold">{label}</label>
//       {type === "select" ? (
//         <select
//           id={id}
//           name={name}
//           required={required}
//           value={value}
//           onChange={onChange}
//           className="border p-2 rounded"
//         >
//           {options.map((option, index) => (
//             <option key={index} value={option.value}>
//               {option.label}
//             </option>
//           ))}
//         </select>
//       ) : (
//         <input
//           id={id}
//           name={name}
//           type={type}
//           placeholder={placeholder}
//           required={required}
//           value={value}
//           onChange={onChange}
          
//           className="border p-2 rounded"
//         />
//       )}
//     </div>
//   );
// };
