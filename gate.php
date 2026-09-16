<?php
$hash = '$2y$12$D0DHPo27TpwkYzHtesj4a.EARPRv8gvxvXtbML/Tfu9s/Hj2DnoWG';
$msg = '';
$success_redirect = null;
if (isset($_POST['pwd'])) {
    if (password_verify($_POST['pwd'], $hash)) {
        setcookie('korat_ok', '1', time() + 60*60*24*30, '/');
        $success_redirect = isset($_POST['redirect']) && $_POST['redirect'] !== '' ? $_POST['redirect'] : '/';
    } else {
        $msg = 'Mot de passe incorrect.';
    }
}
$current = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '/';

if ($success_redirect !== null) {
?>
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Accès autorisé — AmourKorat.com</title>
<meta name="robots" content="noindex,nofollow">
</head>
<body>
<script>
try { localStorage.setItem('korat_ok', '1'); } catch (e) {}
location.replace(<?php echo json_encode($success_redirect); ?>);
</script>
</body>
</html>
<?php
exit;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>KORAT le chat zen — Maintenance</title>
<meta name="robots" content="noindex,nofollow">
<style>
  body{font-family:Georgia,'Times New Roman',serif;background:#eef6ea;color:#1a2e1a;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px;}
  .box{background:#fff;border-radius:12px;padding:40px;max-width:420px;width:100%;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,.08);box-sizing:border-box;}
  h1{font-size:1.6rem;margin:0 0 10px;color:#1a2e1a;}
  p{color:#4a5a4a;margin-bottom:24px;}
  input[type=password]{width:100%;padding:12px;border:1px solid #ccc;border-radius:6px;font-size:1rem;margin-bottom:14px;box-sizing:border-box;}
  button{width:100%;padding:12px;border:none;border-radius:6px;background:#1a2e1a;color:#fff;font-size:1rem;cursor:pointer;}
  button:hover{background:#0f1e0f;}
  .err{color:#a33;margin-bottom:14px;font-size:.95rem;}
</style>
</head>
<body>
<div class="box">
  <h1>KORAT le chat zen</h1>
  <p>Le site est actuellement en cours de maintenance.</p>
  <?php if ($msg): ?><div class="err"><?php echo htmlspecialchars($msg); ?></div><?php endif; ?>
  <form method="post">
    <input type="hidden" name="redirect" value="<?php echo htmlspecialchars($current); ?>">
    <input type="password" name="pwd" placeholder="Mot de passe" autofocus>
    <button type="submit">Accéder</button>
  </form>
</div>
</body>
</html>
