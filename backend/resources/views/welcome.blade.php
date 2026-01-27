<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <?php
        $spend = App\Models\Depense::where('project_id', 1)->get();
        $detail = App\Models\Detail::where('depense_id', 1)->get();
        echo "<pre>";
        var_dump($spend);
        echo "</pre>";
    ?>
</body>
</html>