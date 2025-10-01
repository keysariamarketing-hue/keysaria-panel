export const PersistLoader = () => {
  return (
    <div className="flex items-center justify-center py-40 pb-60 bg-white">
      <div className="flex flex-col">
        <div className="flex space-x-24">
          <div className="container space-y-10 relative">
            <div className="flex">
              <div className="relative">
                <div
                  className="w-14 h-14 rounded-full absolute
                            border-8 border-solid border-[black]"
                ></div>

                <div
                  className="w-14 h-14 rounded-full animate-spin absolute
                            border-8 border-solid border-[] border-t-transparent"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
