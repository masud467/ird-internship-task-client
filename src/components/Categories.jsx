"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { FiLayers } from "react-icons/fi";

const Categories = ({ onSelectContent }) => {
  const router = useRouter();
  const [data, setData] = useState({
    categories: [],
    subcategories: [],
    duas: []
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState({
    category: null,
    subcategory: null
  });
  
  const scrollContainerRef = useRef(null);
  const categoryRefs = useRef({});
  const isInitialInteraction = useRef(true);

  useEffect(() => {
    const savedState = localStorage.getItem("categoryState");
    if (savedState) {
      const { categoryId, subcategoryId } = JSON.parse(savedState);
      setExpandedIds({ category: categoryId, subcategory: subcategoryId });
      
      setTimeout(() => {
        if (categoryId && categoryRefs.current[categoryId]) {
          scrollToElement(categoryRefs.current[categoryId]);
        }
      }, 100);
    }

    const fetchData = async () => {
      try {
        const [categories, subcategories, duas] = await Promise.all([
          fetch("http://localhost:3003/categories").then(res => res.json()),
          fetch("http://localhost:3003/subcategories").then(res => res.json()),
          fetch("http://localhost:3003/duas").then(res => res.json())
        ]);
        setData({ categories, subcategories, duas });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const scrollToElement = (element) => {
    if (!scrollContainerRef.current || !element) return;
    
    const container = scrollContainerRef.current;
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Only scroll if element is not fully visible
    if (elementRect.top < containerRect.top || elementRect.bottom > containerRect.bottom) {
      element.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const handleCategoryClick = (category) => {
    const prevScroll = scrollContainerRef.current?.scrollTop;
    const newState = {
      category: expandedIds.category === category.cat_id ? null : category.cat_id,
      subcategory: null
    };
    
    setExpandedIds(newState);
    saveState(newState);
    updateUrl(category.cat_id, category.cat_name_en);
    
    setTimeout(() => {
      if (isInitialInteraction.current) {
        if (categoryRefs.current[category.cat_id]) {
          scrollToElement(categoryRefs.current[category.cat_id]);
        }
        isInitialInteraction.current = false;
      } else if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = prevScroll;
      }
    }, 0);
    
    onSelectContent({ type: "category", id: category.cat_id });
  };

  const handleSubcategoryClick = (category, subcategory, e) => {
    e.stopPropagation();
    const prevScroll = scrollContainerRef.current?.scrollTop;
    const newState = {
      category: category.cat_id,
      subcategory: expandedIds.subcategory === subcategory.subcat_id ? null : subcategory.subcat_id
    };
    
    setExpandedIds(newState);
    saveState(newState);
    updateUrl(category.cat_id, category.cat_name_en, subcategory.subcat_id);
    
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = prevScroll;
      }
    }, 0);
    
    onSelectContent({ type: "subcategory", id: subcategory.subcat_id });
  };

  // Helper functions
  const saveState = (state) => {
    localStorage.setItem("categoryState", JSON.stringify({
      categoryId: state.category,
      subcategoryId: state.subcategory
    }));
  };

  const updateUrl = (catId, catName, subcatId, duaId) => {
    const slug = catName.toLowerCase().replace(/\s+/g, "-");
    let url = `/duas/${slug}?cat=${catId}`;
    if (subcatId) url += `&subcat=${subcatId}`;
    if (duaId) url += `&dua=${duaId}`;
    router.push(url, undefined, { shallow: true });
  };

  // Filter and data processing functions
  const filteredCategories = data.categories.filter(category =>
    category.cat_name_en.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const uniqueCategories = [...new Map(
    filteredCategories.map(item => [item.cat_id, item])
  ).values()];

  const getSubcategories = (catId) => 
    data.subcategories.filter(sub => sub.cat_id === catId);

  const getDuas = (subcatId) => 
    data.duas.filter(dua => dua.subcat_id === subcatId);

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

      <div className="overflow-y-auto h-[60vh]" ref={scrollContainerRef}>
        {uniqueCategories.map((category) => (
          <div
            key={`category-${category.cat_id}`}
            ref={el => categoryRefs.current[category.cat_id] = el}
            className="border-b pb-4 mb-4 last:border-b-0 last:pb-0"
          >
            <div
              className="flex items-center justify-between mb-2 cursor-pointer"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="flex items-center gap-2">
                <FiLayers className="text-2xl text-green-500" />
                <div>
                  <h3 className="text-lg font-semibold">{category.cat_name_en}</h3>
                  <p className="text-sm text-gray-500">
                    Subcategory: {category.no_of_subcat}
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold bg-green-100 text-green-600 px-2 py-1 rounded-md">
                {category.no_of_dua} Duas
              </span>
            </div>

            {expandedIds.category === category.cat_id && (
              <ul className="pl-8 text-sm text-gray-600">
                {getSubcategories(category.cat_id).map((subcategory) => (
                  <li
                    key={`subcat-${subcategory.subcat_id}`}
                    className="my-2 relative"
                  >
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={(e) => handleSubcategoryClick(category, subcategory, e)}
                    >
                      <div className="relative">
                        <div className="flex items-center gap-2">
                          <div className="absolute top-[-8px] left-[2px] h-[calc(100%+24px)] border-l-2 border-dotted border-green-500"></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full relative z-10"></div>
                          <span>{subcategory.subcat_name_en}</span>
                        </div>
                      </div>
                      <IoIosArrowForward
                        className={`transform transition-transform ${
                          expandedIds.subcategory === subcategory.subcat_id ? "rotate-90" : ""
                        }`}
                      />
                    </div>

                    {expandedIds.subcategory === subcategory.subcat_id && (
                      <ul className="pl-8 list-decimal text-gray-600 mt-2 relative">
                        <div className="absolute top-0 left-[2px] h-full border-l-2 border-dotted border-green-500"></div>
                        {getDuas(subcategory.subcat_id).map((dua) => (
                          <li
                            key={`dua-${dua.dua_id}`}
                            className="my-1 cursor-pointer hover:text-green-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateUrl(
                                category.cat_id,
                                category.cat_name_en,
                                subcategory.subcat_id,
                                dua.dua_id
                              );
                              onSelectContent({ type: "dua", id: dua.dua_id });
                            }}
                          >
                            {dua.dua_name_en}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;