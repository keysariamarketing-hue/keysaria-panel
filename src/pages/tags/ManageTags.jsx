import { useEffect, useState } from "react";
import { createTag, getAllTagList } from "../../api/admin/adminTagAPI";
import { Modal } from "antd";
import { MdDelete, MdEditSquare } from "react-icons/md";
import useAxiosPrivate from "../../hook/useAxiosPrivate";
import { ButtonLoader } from "../../components/general/ButtonLoader";
import { DataLoader } from "../../components/general/DataLoader";


const ManageTags = () => {
  const privateAxios = useAxiosPrivate();
  const [addTagModal, setAddTagModal] = useState(false);
  const [tagName, setTagName] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [loader, setLoader] = useState(false);

  const [dataLoader, setDataLoader] = useState(false);

  //add tag...................
  const addTag = async () => {
    setLoader(true);
    const allData = { privateAxios, tagName };
    try {
      setLoader(false);
      const res = await createTag(allData);
      if (res.status == 201) {
        setTagName('');
        setAddTagModal(false);
        getAllTags();
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  //get all tags................
  const getAllTags = async () => {
    setDataLoader(true);

    const allData = { privateAxios };
    try {
      setDataLoader(false);
      const res = await getAllTagList(allData);
      setAllTags(res.data.data);
    } catch (error) {
      setDataLoader(false);

      console.log(error);
    }
  };

  useEffect(() => {
    getAllTags();
  }, []);

  return (
    <>
      <Modal
        open={addTagModal}
        centered
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setAddTagModal(false)}
      >
        <div className='flex flex-col items-center'>
          <h4>Add Tag</h4>
          <div className='relative float-label-input mt-5 w-1/2'>
            <input
              type='text'
              placeholder=''
              className='block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 appearance-none leading-normal'
              id='tagName'
              name='tagName'
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
            />
            <label
              htmlFor='tagName'
              className='absolute top-2 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker'
            >
              Tag Name
            </label>
          </div>
          <button
            onClick={addTag}
            className='m-5 w-1/2  shadow-xl bg-gradient-to-tr cta text-white py-2 flex justify-center items-center rounded-md text-lg tracking-wide transition duration-1000'
          >
            {loader ? <ButtonLoader /> : 'Add'}
          </button>
        </div>
      </Modal>
      <div className=''>
        <div className=''>
          <div className='w-full space-y-4 mt-4 pb-5'>
            <div className='flex w-full items-center  gap-3'>
              <div className='w-full flex items-center gap-2  '>
                <h4>All Tags</h4>
                <button
                  onClick={() => setAddTagModal(true)}
                  className='cta p-2 rounded-md text-white'
                >
                  Add New Tag
                </button>
              </div>
            </div>
            <hr />
            <div className='grid grid-cols-5 gap-5'>
              {dataLoader ? (
                <DataLoader />
              ) : allTags.length > 0 ? (
                allTags.map((item, index) => (
                  <div
                    key={index}
                    className='w-52 h-52 shadow-lg bg-blue-gray-100 rounded-lg flex flex-col justify-center items-center'
                  >
                    <h4>{item.name}</h4>
                    <div className='flex gap-4 mt-2'>
                      <button>
                        <MdDelete className='text-2xl' />{' '}
                      </button>
                      <button>
                        <MdEditSquare className='text-2xl' />{' '}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <h4>No tags</h4>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageTags;
