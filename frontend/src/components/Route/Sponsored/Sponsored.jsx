import React from 'react'
import styles from '../../../styles/styles'

const Sponsored = () => {
  return (
    <div className={`${styles.section} hidden sm:block bg-white py-10 px-5 mb-12 cursor-pointer rounded-lg`}>
        <div className="flex justify-between w-full">
            <div className="flex items-center">
                <img src="https://1000logos.net/wp-content/uploads/2021/05/Sony-logo.png" alt="Sponsored" className=" h-12" style={{width:"150px", objectFit:"contain"}}/>
                <div className="ml-3">
                    <p className="text-lg font-semibold">Sponsored</p>
                    <p className="text-sm text-gray-500">Get up to 50% off on all products</p>
                </div>
            </div>
            <div className="flex items-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Dell_Logo.png/799px-Dell_Logo.png" alt="Sponsored" className=" h-12" style={{width:"150px", objectFit:"contain"}}/>
                <div className="ml-3">
                    <p className="text-lg font-semibold">Sponsored</p>
                    <p className="text-sm text-gray-500">Get up to 50% off on all products</p>
                </div>
            </div>
            <div className="flex items-center">
                <img src="https://images.squarespace-cdn.com/content/v1/502a8efb84ae42cbccf920c4/1585574686746-VCDIHSO21O76WR72WIAD/LG-Logo.png" alt="Sponsored" className=" h-12" style={{width:"150px", objectFit:"contain"}}/>
                <div className="ml-3">
                    <p className="text-lg font-semibold">Sponsored</p>
                    <p className="text-sm text-gray-500">Get up to 50% off on all products</p>
                </div>
            </div>
            <div className="flex items-center">
                <img src="https://www.transparentpng.com/thumb/apple-logo/RRgURB-apple-logo-clipart-hd.png" alt="Sponsored" className=" h-12" style={{width:"150px", objectFit:"contain"}} />
                <div className="ml-3">
                    <p className="text-lg font-semibold">Sponsored</p>
                    <p className="text-sm text-gray-500">Get up to 50% off on all products</p>
                </div>
            </div>
            <div className="flex items-center">
                <img src="https://cdn.pixabay.com/photo/2013/02/12/09/07/microsoft-80658_1280.png" alt="Sponsored" className=" h-12" style={{width:"150px", objectFit:"contain"}}/>
                <div className="ml-3">
                    <p className="text-lg font-semibold">Sponsored</p>
                    <p className="text-sm text-gray-500">Get up to 50% off on all products</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Sponsored