/**
 * Created by peter on 5/15/16.
 */

export const csrf_check = function(root){
  console.log('CSRF cookie '+root.request.cookies.csrf_token);
  console.log('CSRF header '+root.request.get('X-CSRF-TOKEN'));
  return !(root.request.cookies.csrf_token === root.request.get('X-CSRF-TOKEN'))
};

export const csrf_error_message = "Failed to validate csrf token...";
