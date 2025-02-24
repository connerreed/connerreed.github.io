import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import backendURL from "../utils/backendURL";
import useApiRequest from "../hooks/useApiRequest";

const Recipe = () => {
    const { id } = useParams();
    const {
        data: recipe,
        currentlyLoading: loading,
        fetchData,
    } = useApiRequest();

    useEffect(() => {
        window.scrollTo(0, 0);
        const recipeApiEndpoint = `${backendURL}/api/recipes/${id}/`;
        fetchData(recipeApiEndpoint);
    }, [id, fetchData]);

    const dateUploaded = new Date(recipe?.date_uploaded);
    const dayUploaded = dateUploaded.getDate();
    const monthUploaded = dateUploaded.getMonth() + 1;
    const yearUploaded = dateUploaded.getFullYear();

    return (
        <>
            {loading && <Loading blocking />}
            <div className="d-flex justify-content-center">
                <div className="recipe-content-container col-lg-4 col-md-6 col-sm-10">
                    <div>
                        <h1 className="text-center">
                            <strong>{recipe?.title}</strong>
                        </h1>
                    </div>
                    <div className="mt-3">
                        <div>
                            Recipe Author:{" "}
                            <strong>{recipe?.recipeAuthor}</strong>{" "}
                        </div>
                        <div className="d-inline-block">
                            Uploaded By:{" "}
                            <strong>
                                {recipe?.user.first_name}{" "}
                                {recipe?.user.last_name}
                            </strong>{" "}
                            |
                        </div>{" "}
                        <div className="d-inline-block">
                            Date Uploaded: {monthUploaded}/{dayUploaded}/
                            {yearUploaded}
                        </div>
                    </div>
                    {recipe?.description !== "" && (
                        <div className="mt-3">
                            <p>{recipe?.description}</p>
                        </div>
                    )}
                    <div className="mt-3">
                        <img
                            className="w-100 h-auto"
                            src={recipe?.thumbnail}
                            alt="Recipe Thumbnail"
                        />
                    </div>
                    {recipe?.serialized_images?.length > 0 && (
                        <div className="mt-3">
                            {recipe.serialized_images.map((image, index) => {
                                return (
                                    <img
                                        key={index}
                                        className="w-100 mb-3 h-auto"
                                        src={image.image}
                                        alt={`${image.recipe_title} Recipe`}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Recipe;
