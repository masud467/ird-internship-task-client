"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { BiCopy, BiBookmark, BiShareAlt } from "react-icons/bi";
import { IoBulbOutline } from "react-icons/io5";
import { FiInfo } from "react-icons/fi";
import { HiMenu } from "react-icons/hi";
import Profile from "./Profile";
import Categories from "./Categories";
import Sidebar from "./Sidebar";
import Image from "next/image";
import audio from "../../public/image/audio.png";
import image from "../../public/image/allah (Traced).png";

const Main = () => {
  const [duas, setDuas] = useState([]);
  const [filteredDuas, setFilteredDuas] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loadingStates, setLoadingStates] = useState({
    initial: true,
    categoryChange: false,
  });
  const [preloadedData, setPreloadedData] = useState({
    categoryData: {},
    subcategoryData: {},
  });
  const [selectedDuaId, setSelectedDuaId] = useState(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [duasResponse, categoriesResponse, subcategoriesResponse] =
          await Promise.all([
            fetch("https://ird-foundation-task-server.vercel.app/duas"),
            fetch("https://ird-foundation-task-server.vercel.app/categories"),
            fetch(
              "https://ird-foundation-task-server.vercel.app/subcategories"
            ),
          ]);

        const [duasData, categoriesData, subcategoriesData] = await Promise.all(
          [
            duasResponse.json(),
            categoriesResponse.json(),
            subcategoriesResponse.json(),
          ]
        );
        // ===============================================================================
        // Get saved state
        const savedState = localStorage.getItem("categoryState");
        if (savedState) {
          const { categoryId, subcategoryId } = JSON.parse(savedState);

          // Filter duas based on saved state
          let filteredDuasData = duasData;
          if (subcategoryId) {
            filteredDuasData = duasData.filter(
              (dua) => dua.subcat_id === subcategoryId
            );
            const subcategory = subcategoriesData.find(
              (sub) => sub.subcat_id === subcategoryId
            );
            setSelectedSubcategory(subcategory?.subcat_name_en || "");
          } else if (categoryId) {
            filteredDuasData = duasData.filter(
              (dua) => dua.cat_id === categoryId
            );
            const category = categoriesData.find(
              (cat) => cat.cat_id === categoryId
            );
            setSelectedCategory(category?.cat_name_en || "");
          }
          setFilteredDuas(filteredDuasData);
        } else {
          setFilteredDuas(duasData);
        }

        setDuas(duasData);
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
        // ===============================================================================
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  // ====================================================================================
  const handleContentSelect = (selection) => {
    let filteredDuasData = [];
    let newSelectedDuaId = null;
    switch (selection.type) {
      case "category": {
        filteredDuasData = duas.filter((dua) => dua.cat_id === selection.id);
        const category = categories.find((cat) => cat.cat_id === selection.id);
        setSelectedCategory(category?.cat_name_en || "");
        setSelectedSubcategory("");
        break;
      }
      case "subcategory": {
        filteredDuasData = duas.filter((dua) => dua.subcat_id === selection.id);
        const subcategory = subcategories.find(
          (sub) => sub.subcat_id === selection.id
        );
        const category = categories.find(
          (cat) => cat.cat_id === subcategory?.cat_id
        );
        setSelectedCategory(category?.cat_name_en || "");
        setSelectedSubcategory(subcategory?.subcat_name_en || "");
        break;
      }
      case "dua": {
        newSelectedDuaId = selection.id;
        // Find the subcategory of the selected dua
        const selectedDua = duas.find((dua) => dua.dua_id === selection.id);
        if (selectedDua) {
          filteredDuasData = duas.filter(
            (dua) => dua.subcat_id === selectedDua.subcat_id
          );
          const subcategory = subcategories.find(
            (sub) => sub.subcat_id === selectedDua.subcat_id
          );
          const category = categories.find(
            (cat) => cat.cat_id === subcategory?.cat_id
          );
          setSelectedCategory(category?.cat_name_en || "");
          setSelectedSubcategory(subcategory?.subcat_name_en || "");
        }
        break;
      }
      default:
        filteredDuasData = duas;
    }
    setFilteredDuas(filteredDuasData);
    setSelectedDuaId(selectedDuaId); // Add this state to track the selected dua
    setIsDrawerOpen(false);

    setTimeout(() => {
      if (newSelectedDuaId) {
        scrollToDua(newSelectedDuaId);
      } else if (filteredDuasData.length > 0) {
        // Scroll to top of the list if no specific dua selected
        scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);
  };

  // New scroll function that ensures full dua visibility
  const scrollToDua = (duaId) => {
    const element = document.getElementById(`dua-${duaId}`);
    if (element && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const elementRect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // Calculate position to show the entire dua card from top
      const scrollPosition = element.offsetTop - container.offsetTop - 20; // 20px padding

      container.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  // ====================================================================================

  const renderDuaCard = (dua, index) => (
    <div
      key={`${dua.cat_id}-${dua.subcat_id}-${dua.dua_id}-${index}`}
      className={`bg-white rounded-lg py-4 px-7 space-y-2 border transition-all duration-300 ease-in-out flex flex-col gap-[28px] ${
        dua.dua_id === selectedDuaId ? "ring-2 ring-green-500" : ""
      }`}
      id={`dua-${dua.dua_id}`}
    >
      <div className="flex gap-5">
        <Image
          src={image}
          alt="image Icon"
          className=" rounded-full"
          width={30}
          height={30}
        />{" "}
        <h2 className="text-green-600 font-semibold text-lg leading-[25px]">
          {dua.dua_id}. {dua.dua_name_en}
        </h2>
      </div>
      {dua.top_en && (
        <p className="text-[#393939] text-[16px] font-normal leading-6 text-justify">
          {dua.top_en}
        </p>
      )}

      {dua.dua_arabic && (
        <p className="text-[#393939] text-2xl font-normal leading-[71px] text-right">
          {dua.dua_arabic}
        </p>
      )}

      {dua.transliteration_en && (
        <p className="text-[#393939] text-[16px] font-semibold leading-[25px] text-justify">
          Transliteration:{" "}
          <span className="font-normal italic">{dua.transliteration_en}</span>
        </p>
      )}
      {dua.translation_en && (
        <p className="text-[#393939] text-[16px] font-semibold leading-[25px] text-justify">
          Translation: <span className="font-normal">{dua.translation_en}</span>
        </p>
      )}

      {dua.refference_en && (
        <p className="text-lg font-semibold leading-6 text-[#1FA45B]">
          Reference: <br />
          <span className="font-medium text-[#393939] leading-6">
            {dua.refference_en}
          </span>
        </p>
      )}
      <div className="flex items-center justify-between text-gray-500">
        <div>
          <Image
            src={audio}
            alt="Audio Icon"
            className=" rounded-full"
            width={44}
            height={44}
          ></Image>
        </div>
        <div className="flex items-center justify-end gap-10 text-gray-500">
          <BiCopy className="cursor-pointer hover:text-green-600 text-2xl" />
          <BiBookmark className="cursor-pointer hover:text-green-600 text-2xl" />
          <IoBulbOutline className="cursor-pointer hover:text-green-600 text-2xl" />
          <FiInfo className="cursor-pointer hover:text-green-600 text-2xl" />
          <BiShareAlt className="cursor-pointer hover:text-green-600 text-2xl" />
        </div>
      </div>
    </div>
  );

  // Add this useEffect to scroll to the selected dua:
  useEffect(() => {
    if (selectedDuaId) {
      setTimeout(() => {
        const element = document.getElementById(`dua-${selectedDuaId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 100);
    }
  }, [selectedDuaId]);

  return (
    <div className="bg-[#EBEEF2] h-screen py-10 overflow-hidden">
      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden ${
          isDrawerOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsDrawerOpen(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 w-80 bg-white z-50 transform transition-transform duration-300 lg:hidden ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto">
          <Categories onSelectContent={handleContentSelect} />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid grid-cols-12 gap-4 mx-8">
        <div className="col-span-1">
          <Sidebar />
        </div>
        <div className="col-span-3">
          <h1 className="text-xl font-semibold pb-5">Dua Pages</h1>
          <Categories onSelectContent={handleContentSelect} />
        </div>

        <div className="col-span-8">
          <div className="flex gap-28">
            <div className="flex w-80 items-center bg-white rounded-lg py-1 px-4 mb-4 ml-auto">
              <input
                type="text"
                placeholder="Search by Dua Name"
                className="left-1 w-full px-4 py-2 border-none focus:outline-none"
              />
              <FaSearch className="text-gray-400" />
            </div>
            <div>
              <Profile />
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className="overflow-y-auto h-[60vh] scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300"
          >
            <div className="min-h-[600px] transition-all duration-300 ease-in-out">
              {selectedCategory && (
                <div className="bg-green-100 text-green-700 font-semibold text-lg rounded-md py-2 px-4 mb-4 transition-opacity duration-300">
                  Section: {selectedCategory}
                  {selectedSubcategory && ` > ${selectedSubcategory}`}
                </div>
              )}
              <div className="space-y-4 transition-all duration-300">
                {filteredDuas.map((dua, index) => renderDuaCard(dua, index))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden px-4">
        <div className="flex items-center justify-between mb-4">
          <button
            className="p-2 bg-white rounded-lg"
            onClick={() => setIsDrawerOpen(true)}
          >
            <HiMenu className="text-2xl" />
          </button>
          <div className="flex items-center gap-4">
            <div className="flex w-full items-center bg-white rounded-lg py-1 px-4">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-2 py-1 border-none focus:outline-none"
              />
              <FaSearch className="text-gray-400" />
            </div>
            <Profile />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-150px)]">
          {selectedCategory && (
            <div className="bg-green-100 text-green-700 font-semibold text-base rounded-md py-2 px-4 mb-4">
              Section: {selectedCategory}
              {selectedSubcategory && ` > ${selectedSubcategory}`}
            </div>
          )}
          <div className="space-y-4">
            {filteredDuas.map((dua, index) => renderDuaCard(dua, index))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
