const express = require("express");
const router = express.Router();


const {
  add_blog,
  update_blog,
  get_blog_by_id,
  delete_blog,
  get_all_blogs,
} = require("../Modules/Admin/Blog");

const {
  add_project,
  update_project,
  get_all_projects,
  get_project_by_id,
  delete_project,
} = require("../Modules/Admin/Porject");

const {
  add_installment,
  update_installment,
  get_all_installments,
  get_installment_by_id,
  delete_installment,
  get_installment_by_email,
} = require("../Modules/Admin/Installment");

const {
  get_all_newsletters,
  delete_newsletter_by_id,
  create_newsletter,
} = require("../Modules/Admin/news_letter");

const {
  add_booking,
  delete_booking,
  get_booking_by_id,
  get_all_bookings,
  update_booking,
} = require("../Modules/Admin/Booking");
const {
  get_all_contacts,
  delete_contact_by_id,
} = require("../Modules/Admin/Contact");

const {
  add_testimonial, get_testimonials, delete_testimonial
} = require('../Modules/Admin/Testimonial')

const {
  get_serialized_booking,
  get_preview,
  get_all_land,
  get_user_land,
  delete_land_registration,
  edit_land_registration,
  add_land_registration } = require('../Modules/Admin/user_history')


const { add_banner, update_banner, get_all_banners, get_banner_by_id, delete_banner } = require('../Modules/Admin/Banner');
//blogs router:

router.post("/blog/add", add_blog);
router.put("/blog/update", update_blog);
router.get("/blog/blogs", get_all_blogs);
router.get("/blog/get-blog", get_blog_by_id);
router.delete("/blog/delete", delete_blog);

// project router
router.post("/project/add", add_project);
router.put("/project/update", update_project);
router.get("/project/projects", get_all_projects);
router.get("/project/get-project", get_project_by_id);
router.delete("/project/delete", delete_project);

//installment router
router.post("/installment/add", add_installment);
router.put("/installment/update", update_installment);
router.get("/installment/installments", get_all_installments);
router.get("/installment/get-installment", get_installment_by_id);
router.get("/installment/get-installment-email", get_installment_by_email);
router.delete("/installment/delete", delete_installment);

//news letter
router.get("/news-letter/get", get_all_newsletters);
router.delete("/news-letter/delete-by-id", delete_newsletter_by_id);
router.post("/news-letter/add", create_newsletter);

//booking router
router.post("/booking/add", add_booking);
router.put("/booking/update", update_booking);
router.get("/booking/bookings", get_all_bookings);
router.get("/booking/get-booking", get_booking_by_id);
router.delete("/booking/delete", delete_booking);

///!  contact

router.get("/contacts", get_all_contacts);
// router.get("/contact/get-contact", get_contact_by_id);
router.delete("/contact/delete", delete_contact_by_id);


router.post("/testimonial", add_testimonial);
router.get('/testimonial', get_testimonials)
router.delete('/testimonial', delete_testimonial)


router.get('/serial-number', get_serialized_booking)
router.delete("/delete-land-registration", delete_land_registration)

router.post('/add-land-registration', add_land_registration)
router.get("/all-land-registration", get_all_land)
router.get("/user-land-registration", get_user_land)
router.get("/single-land-registration", get_preview)
router.put("/edit-land-registration", edit_land_registration)



//banner router
router.post('/banner/add', add_banner);
router.put('/banner/update', update_banner);
router.get('/banner/banners', get_all_banners)
router.get('/banner/get-banner', get_banner_by_id);
router.delete('/banner/delete', delete_banner);

module.exports = router;
