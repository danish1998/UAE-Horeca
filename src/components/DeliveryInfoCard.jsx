import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { getDeliveryDate } from "../utils/formatDate";
const DeiveryInfoCard = ({ lastestOrder }) => {
  return (
    <>
      {lastestOrder && lastestOrder.updated_at ? <>  <div className="grid grid-cols-1 md:grid-cols-6 gap-2 p-2">
        {/* Left column: Delivery Info */}
        <div className="flex flex-col">
          <p className="mt-1 text-[#212121] font-semibold text-[14px]">
            {/* Sunday, Oct. 6 */}
            {getDeliveryDate(lastestOrder.updated_at, lastestOrder.products[0].delivery_days)}

          </p>
          <p className="text-[#64748B] font-semibold text-[14px]">
            Estimated delivery
          </p>
        </div>

        {/* Right column: Product Info */}
        <div className="flex flex-col items-start space-y-4">
          <div className="flex space-x-4">
            {lastestOrder.products.slice(0, 5).map((item, index) => (
              <div className="w-20 h-20 bg-[#D9D9D9] rounded-md" key={index}>
                <Link to={`/product/${item.product_id}`}>
                  <img src={item.images} alt={item.name} />
                </Link>
              </div>
            ))}
            {lastestOrder.products.length > 5 && (
              <div className="w-20 h-20 bg-[#D9D9D9] rounded-md flex items-center justify-center">
                <span className="text-sm font-medium">
                  +{lastestOrder.products.length - 5}
                </span>
              </div>
            )}




          </div>
        </div>
      </div>


        <div className="mt-5 mb-3 border-t-2 border-[#E2E8F0]" /></> : ''}

    </>
  );
}

export default DeiveryInfoCard;