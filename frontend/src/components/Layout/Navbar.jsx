import React from 'react';
import { Link } from 'react-router-dom';
import { navItems } from '../../static/data';
import styles from '../../styles/styles';

const Navbar = ({ active }) => {
  return (
    <div className={`block 800px:${styles.noramlFlex}`}>
      {navItems &&
        navItems.map((item, index) => (
          <div className="flex items-center" key={index}>
            <Link
              to={item.url}
              className={`${active === index + 1 ? 'text-[#17dd1f]' : 'text-black 800px:text-[#fff]'} pb-[30px] 800px:pb-0 font-[500] px-6 cursor-pointer flex items-center space-x-2`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.title}</span>
            </Link>
          </div>
        ))}
    </div>
  );
};

export default Navbar;
