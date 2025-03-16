import { Plus } from "lucide-react";

const Header = ({ method, tittle, discription, btName, Icon }) => { 
    return (
      <div>
        <div className="max-w-8xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {Icon && <Icon className="w-8 h-8 text-blue-600" />} {/* ✅ Dynamically render icon */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{tittle}</h1>
                  <p className="text-gray-500">{discription}</p>
                </div>
              </div>
              <button
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                onClick={method}
              >
                <Plus size={20} />
                {btName}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Header;
  