"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { FiLayers } from "react-icons/fi";

const Categories = ({ onSelectContent }) => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [duas, setDuas] = useState([]);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [expandedSubcategoryId, setExpandedSubcategoryId] = useState(null);

  const scrollContainerRef = useRef(null);
  const categoryRefs = useRef({});

  useEffect(() => {
    // Load saved states from localStorage
    const savedState = localStorage.getItem("categoryState");
    if (savedState) {
      const { categoryId, subcategoryId } = JSON.parse(savedState);

      setTimeout(() => {
        if (categoryRefs.current[categoryId]) {
          categoryRefs.current[categoryId].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }, 100);

      setExpandedCategoryId(categoryId);
      setExpandedSubcategoryId(subcategoryId);
    }

    const fetchData = async () => {
      try {
        const [categoriesResponse, subcategoriesResponse, duasResponse] =
          await Promise.all([
            fetch("http://localhost:3003/categories"),
            fetch("http://localhost:3003/subcategories"),
            fetch("http://localhost:3003/duas"),
          ]);

        const [categoriesData, subcategoriesData, duasData] = await Promise.all(
          [
            categoriesResponse.json(),
            subcategoriesResponse.json(),
            duasResponse.json(),
          ]
        );

        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
        setDuas(duasData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [categories]);

  const handleCategoryClick = (categoryId, categoryName) => {
    setExpandedCategoryId(categoryId);
    setExpandedSubcategoryId(null);

    // Scroll to clicked category smoothly
    if (categoryRefs.current[categoryId]) {
      categoryRefs.current[categoryId].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }

    // Save state to localStorage
    localStorage.setItem(
      "categoryState",
      JSON.stringify({
        categoryId,
        subcategoryId: null,
      })
    );

    onSelectContent({ type: "category", id: categoryId });
  };

  const handleSubcategoryClick = (
    categoryId,
    categoryName,
    subcatId,
    event
  ) => {
    event.stopPropagation();
    setExpandedSubcategoryId(subcatId);

    // Save state to localStorage
    localStorage.setItem(
      "categoryState",
      JSON.stringify({
        categoryId,
        subcategoryId: subcatId,
      })
    );
    onSelectContent({ type: "subcategory", id: subcatId });
  };

  const handleDuaClick = (categoryId, categoryName, subcatId, duaId, event) => {
    event.stopPropagation();
    // router.push(
    //   `/duas/${categoryName
    //     .toLowerCase()
    //     .replace(
    //       /\s+/g,
    //       "-"
    //     )}?cat=${categoryId}&subcat=${subcatId}&dua=${duaId}`,
    //   { shallow: true }
    // );
    onSelectContent({ type: "dua", id: duaId });
  };

  // ----------------------------------------------------------------------------------------------------

  const filterCategories = categories.filter((category) =>
    category.cat_name_en.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUniqueCategories = (categories) => {
    const seen = new Set();
    return categories.filter((category) => {
      const duplicate = seen.has(category.cat_id);
      seen.add(category.cat_id);
      return !duplicate;
    });
  };

  const uniqueFilteredCategories = getUniqueCategories(filterCategories);

  const getSubcategoriesForCategory = (categoryId) => {
    return subcategories.filter((sub) => sub.cat_id === categoryId);
  };

  const getDuasForSubcategory = (subcategoryId) => {
    return duas.filter((dua) => dua.subcat_id === subcategoryId);
  };

  return (
    <div className="bg-white h-[840px] rounded-lg shadow-lg p-4">
      <div className="bg-green-500 text-white text-center rounded-md py-2 font-bold">
        Categories
      </div>

      <div className="relative my-4">
        <input
          type="text"
          placeholder="Search Categories"
          className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FaSearch className="absolute top-3 right-3 text-gray-400" />
      </div>

      <div className="overflow-y-auto h-[60vh]">
        {uniqueFilteredCategories.map((category, catIndex) => (
          <div
            key={`category-${category.cat_id}-${catIndex}`}
            className="border-b pb-4 mb-4 last:border-b-0 last:pb-0"
          >
            <div
              className="flex items-center justify-between mb-2 cursor-pointer"
              onClick={() => handleCategoryClick(category.cat_id)}
            >
              <div className="flex items-center gap-2">
                <FiLayers className="text-2xl text-green-500" />
                <div>
                  <h3 className="text-lg font-semibold">
                    {category.cat_name_en}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Subcategory: {category.no_of_subcat}
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold bg-green-100 text-green-600 px-2 py-1 rounded-md">
                {category.no_of_dua} Duas
              </span>
            </div>

            {expandedCategoryId === category.cat_id && (
              <ul className="pl-8 text-sm text-gray-600">
                {getSubcategoriesForCategory(category.cat_id).map(
                  (subcat, subcatIndex) => (
                    <li
                      key={`subcat-${category.cat_id}-${subcat.subcat_id}-${subcatIndex}`}
                      className="my-2 relative"
                    >
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={(e) =>
                          handleSubcategoryClick(
                            category.cat_id,
                            category.cat_name_en,
                            subcat.subcat_id,
                            e
                          )
                        }
                      >
                        <div className="relative">
                          <div className="flex items-center gap-2">
                            {/* Dotted Line */}
                            <div className="absolute top-[-8px] left-[2px] h-[calc(100%+24px)] border-l-2 border-dotted border-green-500"></div>

                            {/* Green Circle */}
                            <div className="w-2 h-2 bg-green-500 rounded-full relative z-10"></div>

                            {/* Subcategory Name */}
                            <span>{subcat.subcat_name_en}</span>
                          </div>
                        </div>

                        <IoIosArrowForward
                          className={`transform transition-transform ${
                            expandedSubcategoryId === subcat.subcat_id
                              ? "rotate-90"
                              : ""
                          }`}
                        />
                      </div>

                      {expandedSubcategoryId === subcat.subcat_id && (
                        <ul className="pl-8 list-decimal text-gray-600 mt-2 relative">
                          <div className="absolute top-0 left-[2px] h-full border-l-2 border-dotted border-green-500"></div>
                          {getDuasForSubcategory(subcat.subcat_id).map(
                            (dua, duaIndex) => (
                              <li
                                key={`dua-${subcat.subcat_id}-${dua.dua_id}-${duaIndex}`}
                                className="my-1 cursor-pointer hover:text-green-600"
                                onClick={(e) =>
                                  handleDuaClick(
                                    category.cat_id,
                                    category.cat_name_en,
                                    subcat.subcat_id,
                                    dua.dua_id,
                                    e
                                  )
                                }
                              >
                                {dua.dua_name_en}
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
